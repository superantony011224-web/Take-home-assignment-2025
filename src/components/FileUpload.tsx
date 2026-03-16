import { useCallback, useState } from "react";
import { Upload, X, FileImage } from "lucide-react";

interface FileUploadProps {
  label: string;
  accept: string;
  error?: string;
  onChange: (file: File | undefined) => void;
}

export function FileUpload({ label, accept, error, onChange }: FileUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFile = useCallback(
    (file: File | undefined) => {
      if (file) {
        setFileName(file.name);
        const reader = new FileReader();
        reader.onloadend = () => setPreview(reader.result as string);
        reader.readAsDataURL(file);
      } else {
        setFileName(null);
        setPreview(null);
      }
      onChange(file);
    },
    [onChange]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const clear = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      handleFile(undefined);
    },
    [handleFile]
  );

  return (
    <div>
      <span className="form-label">{label}</span>
      <label
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className={`file-drop-zone mt-1 ${preview ? "has-file" : ""}`}
      >
        <input
          type="file"
          accept={accept}
          className="sr-only"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
        {preview ? (
          <div className="flex items-center gap-3">
            <img
              src={preview}
              alt="Preview"
              className="h-16 w-16 rounded-md object-cover"
            />
            <div className="flex-1 text-sm text-foreground">{fileName}</div>
            <button
              type="button"
              onClick={clear}
              className="rounded-full p-1 hover:bg-muted"
            >
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 text-center">
            <div className="rounded-full bg-primary/10 p-3">
              {label.toLowerCase().includes("insurance") ? (
                <FileImage className="h-6 w-6 text-primary" />
              ) : (
                <Upload className="h-6 w-6 text-primary" />
              )}
            </div>
            <div>
              <span className="text-sm font-medium text-primary">
                Click to upload
              </span>
              <span className="text-sm text-muted-foreground">
                {" "}or drag and drop
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              JPG, PNG or WebP (max 10 MB)
            </p>
          </div>
        )}
      </label>
      {error && <p className="form-error">{error}</p>}
    </div>
  );
}
