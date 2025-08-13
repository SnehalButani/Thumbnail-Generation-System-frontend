import { fileUploadSchema } from "@/schemas/upload";
import { useRef, useState } from "react";

interface FileUploadAreaProps {
  isUploading: boolean;
  onFileUpload: (files: FileList | File[]) => void;
}

const FileUploadArea = ({ isUploading, onFileUpload }: FileUploadAreaProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleBrowseClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    if (!fileInputRef.current?.hasAttribute('data-processing')) {
      fileInputRef.current?.setAttribute('data-processing', 'true');
      fileInputRef.current?.click();

      setTimeout(() => {
        fileInputRef.current?.removeAttribute('data-processing');
      }, 100);
    }
  };

  const handleFileInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];

    try {
      await fileUploadSchema.validate(files, { abortEarly: false });
      setErrors([]);
      setSelectedFiles((prev) => {
        const unique = files.filter(
          (file) => !prev.some((f) => f.name === file.name && f.size === file.size)
        );
        return [...prev, ...unique].slice(0, 5);
      });
    } catch (err: any) {
      if (err.inner) {
        const messages = err.inner.map((validationError: any) => validationError.message);
        setErrors(messages);
      } else {
        setErrors([err.message]);
      }
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };


  const handleUploadClick = () => {
    if (selectedFiles.length) {
      onFileUpload(selectedFiles);
      setSelectedFiles([]);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleRemoveFile = (index: number) =>
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      {/* Drop Zone */}
      <div
        className="border-2 border-dashed border-gray-300 hover:border-blue-400 hover:bg-gray-50 rounded-lg p-8 text-center transition-all duration-200 cursor-pointer"
        onClick={handleBrowseClick}
      >
        <div className="space-y-4">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              {isUploading ? "Uploading files..." : "Drop files here or click to browse"}
            </h3>
            <p className="text-gray-500 mb-4">
              Supported: Images (JPG, PNG, GIF), Videos (MP4, AVI, MOV)
            </p>
            <button
              type="button"
              onClick={handleBrowseClick}
              disabled={isUploading}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Choose Files
            </button>
          </div>
        </div>
      </div>

      {/* File List */}
      {selectedFiles.length > 0 && (
        <div className="mt-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">
            Selected Files ({selectedFiles.length})
          </h4>
          <div className="space-y-3">
            {selectedFiles.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{file.name}</p>
                    <p className="text-sm text-gray-500">{formatFileSize(file.size)}</p>
                  </div>
                </div>
                <button onClick={() => handleRemoveFile(index)} className="text-red-500 hover:text-red-700 p-1">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>

          {/* Upload Button */}
          <div className="mt-6 flex justify-center">
            <button
              type="button"
              onClick={handleUploadClick}
              disabled={isUploading}
              className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-medium py-3 px-8 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {isUploading ? (
                <>
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <span>Upload Files</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {errors.length > 0 && (
        <div className="mt-3 space-y-1">
          {errors.map((error, i) => (
            <p key={i} className="text-red-500 text-sm">
              {error}
            </p>
          ))}
        </div>
      )}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        onChange={handleFileInputChange}
        style={{ display: "none" }}
      />
    </div>
  );
};

export default FileUploadArea;
