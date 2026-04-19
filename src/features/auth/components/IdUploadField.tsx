import { OptimizedImage } from "@/components/shared/OptimizedImage";
import i18next from "i18next";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

interface IDUploadFieldProps {
  label: string;
  value: File | string | null;
  onChange: (file: File | null) => void;
  error?: string;
  isEditing?: boolean;
  initialPreview?: string | null;
}

export function IDUploadField({
  label,
  value,
  onChange,
  error,
  isEditing = true,
  initialPreview = null,
}: IDUploadFieldProps) {
  const [preview, setPreview] = useState<string | null>(initialPreview);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const isArabic = i18next.language === "ar";

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (!isEditing) return;
      const file = acceptedFiles[0];
      if (!file) return;
      onChange(file);
      setPreview(file.type.startsWith("image/") ? URL.createObjectURL(file) : null);
    },
    [onChange, isEditing]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [], "application/pdf": [] },
    maxFiles: 1,
    disabled: !isEditing,
  });

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(null);
    setPreview(null);
  };

  // Determine what's displayable as an image preview
  const displayPreview = preview;
  const hasFile = !!value || !!preview;

  return (
    <>
      {lightboxOpen && displayPreview && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          onClick={() => setLightboxOpen(false)}
        >
          <div className="relative max-w-2xl w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => setLightboxOpen(false)}
              className="absolute -top-3 -right-3 bg-white rounded-full w-7 h-7 flex items-center justify-center shadow text-gray-600 hover:text-red-500 text-sm z-10"
            >
              ✕
            </button>
            <OptimizedImage src={displayPreview} alt="ID preview" className="w-full rounded-xl shadow-2xl" />
          </div>
        </div>
      )}

      <div className="flex flex-col gap-1 flex-1 min-w-0">
        <label className={`text-sm ${isArabic ? "text-right" : "text-left"} font-medium text-gray-700`}>{label}</label>
        <div
          {...getRootProps()}
          className={`relative flex flex-col items-center justify-center gap-2 border-2 rounded-xl p-4 transition-colors h-52
            ${!isEditing
              ? "border-gray-200 bg-gray-50 cursor-default"
              : `border-dashed cursor-pointer
                 ${isDragActive ? "border-navy bg-blue-50" : "border-gray-300 bg-gray-50 hover:border-navy hover:bg-blue-50"}
                 ${error ? "border-red-400 bg-red-50" : ""}`
            }
          `}
        >
          <input {...getInputProps()} />

          {displayPreview ? (
            <>
              <OptimizedImage
                src={displayPreview}
                alt="ID thumbnail"
                onClick={(e) => { e.stopPropagation(); setLightboxOpen(true); }}
                className="h-36 w-full object-contain rounded-lg cursor-zoom-in hover:opacity-80 transition-opacity"
                title="Click to enlarge"
              />
              <p className="text-xs text-gray-400 truncate w-full text-center px-1">
                {value instanceof File ? value.name : null}
              </p>
              {isEditing && (
                <button
                  type="button"
                  onClick={handleRemove}
                  className="absolute top-2 right-2 bg-white border border-gray-300 rounded-full w-5 h-5 flex items-center justify-center text-gray-400 hover:text-red-500 hover:border-red-400 shadow-sm text-xs leading-none"
                >
                  ✕
                </button>
              )}
            </>
          ) : hasFile ? (
            <>
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 text-xl">📄</div>
              <p className="text-xs text-gray-500 truncate w-full text-center px-1">{value instanceof File ? value.name : label}</p>
              {isEditing && (
                <button
                  type="button"
                  onClick={handleRemove}
                  className="absolute top-2 right-2 bg-white border border-gray-300 rounded-full w-5 h-5 flex items-center justify-center text-gray-400 hover:text-red-500 hover:border-red-400 shadow-sm text-xs leading-none"
                >
                  ✕
                </button>
              )}
            </>
          ) : isEditing ? (
            <>
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 text-xl">⬆</div>
              <p className="text-xs text-gray-500 text-center">
                {isDragActive ? "Drop here…" : "Drag & drop or click"}
              </p>
              <p className="text-xs text-gray-400">PNG, JPG, PDF · max 10MB</p>
            </>
          ) : (
            <>
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 text-xl">📄</div>
              <p className="text-xs text-gray-500 text-center">No ID uploaded</p>
            </>
          )}
        </div>
        {error && <p className="text-red-500 text-xs">{error}</p>}
      </div>
    </>
  );
}