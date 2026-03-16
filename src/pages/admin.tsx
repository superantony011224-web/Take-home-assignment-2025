import { useState, useMemo } from "react";
import { AgGridReact } from "ag-grid-react";
import type { ColDef, ICellRendererParams } from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import Head from "next/head";
import Link from "next/link";
import type { GetServerSideProps } from "next";
import { prisma } from "@/lib/prisma";

interface PatientRow {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  address: string;
  insuranceCardUrl: string | null;
  photoIdUrl: string | null;
  createdAt: string;
}

function ImagePreviewCell({ value }: ICellRendererParams) {
  const [open, setOpen] = useState(false);
  if (!value) return <span className="text-muted-foreground text-xs">—</span>;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="text-xs font-medium text-primary underline-offset-2 hover:underline"
      >
        View
      </button>
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => setOpen(false)}
        >
          <div
            className="card max-h-[80vh] max-w-lg overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={value}
              alt="Document"
              className="w-full rounded-md"
            />
            <button
              onClick={() => setOpen(false)}
              className="btn-secondary mt-4 w-full"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const profiles = await prisma.patientProfile.findMany({
    orderBy: { createdAt: "desc" },
  });

  return {
    props: {
      profiles: profiles.map((p) => ({
        ...p,
        createdAt: p.createdAt.toISOString(),
        updatedAt: p.updatedAt.toISOString(),
      })),
    },
  };
};

export default function AdminPage({
  profiles,
}: {
  profiles: PatientRow[];
}) {
  const columnDefs = useMemo<ColDef<PatientRow>[]>(
    () => [
      { field: "firstName", headerName: "First Name", minWidth: 120 },
      { field: "lastName", headerName: "Last Name", minWidth: 120 },
      { field: "email", minWidth: 200 },
      { field: "phone", minWidth: 140 },
      { field: "dateOfBirth", headerName: "DOB", minWidth: 120 },
      { field: "address", minWidth: 220 },
      {
        field: "insuranceCardUrl",
        headerName: "Insurance Card",
        cellRenderer: ImagePreviewCell,
        sortable: false,
        filter: false,
        minWidth: 130,
      },
      {
        field: "photoIdUrl",
        headerName: "Photo ID",
        cellRenderer: ImagePreviewCell,
        sortable: false,
        filter: false,
        minWidth: 110,
      },
      {
        field: "createdAt",
        headerName: "Created",
        minWidth: 170,
        valueFormatter: ({ value }) =>
          new Date(value).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }),
      },
    ],
    []
  );

  const defaultColDef = useMemo<ColDef>(
    () => ({
      sortable: true,
      filter: true,
      resizable: true,
    }),
    []
  );

  return (
    <>
      <Head>
        <title>Admin - Patient Profiles</title>
      </Head>

      <div className="page-container max-w-7xl">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="page-title">Patient Profiles</h1>
            <p className="page-subtitle">
              {profiles.length} patient{profiles.length !== 1 ? "s" : ""}{" "}
              registered
            </p>
          </div>
          <Link href="/" className="btn-secondary text-xs">
            Intake Form
          </Link>
        </header>

        <div className="ag-theme-quartz mt-8" style={{ height: 600 }}>
          <AgGridReact<PatientRow>
            rowData={profiles}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            pagination={true}
            paginationPageSize={20}
            domLayout="normal"
          />
        </div>
      </div>
    </>
  );
}
