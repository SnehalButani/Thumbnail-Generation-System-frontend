import { type UploadedFile } from "@/hooks/useFileUpload";

interface FileStatusGridProps {
  files: UploadedFile[];
  onRemoveFile: (_id: string) => void;
}

const FileStatusGrid = ({ files, onRemoveFile }: FileStatusGridProps) => {

  const handleDownload = async (file: UploadedFile) => {
    if (!file.thumbnailUrl) return;
  
    const url = `${import.meta.env.VITE_API_URL}${file.thumbnailUrl}`;
  
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Failed to fetch thumbnail: ${response.statusText}`);
  
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
  
      const ext = file.thumbnailUrl.split(".").pop() || "jpg";
      const baseName = file.originalFileName.replace(/\.[^/.]+$/, "");
  
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `thumbnail_${baseName}.${ext}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error("Download failed:", err);
    }
  };
  
  

  const getStatusBadge = (status: UploadedFile["status"]) => {
    const statusConfig = {
      pending: { color: "bg-gradient-to-r from-gray-500 to-gray-600", text: "Pending", icon: "⏳" },
      queued: { color: "bg-gradient-to-r from-blue-500 to-blue-600", text: "Queued", icon: "📋" },
      processing: { color: "bg-gradient-to-r from-yellow-500 to-orange-500", text: "Processing", icon: "⚙️" },
      completed: { color: "bg-gradient-to-r from-green-500 to-emerald-600", text: "Completed", icon: "✅" },
      failed: { color: "bg-gradient-to-r from-red-500 to-red-600", text: "Failed", icon: "❌" },
      uploading: { color: "bg-gradient-to-r from-purple-500 to-purple-600", text: "Uploading", icon: "📤" },
    };

    const config = statusConfig[status];
    return (
      <span
        className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold text-white ${config.color} shadow-lg backdrop-blur-sm`}
      >
        <span className="mr-1">{config.icon}</span>
        {config.text}
      </span>
    );
  };

  const getStatusIcon = (status: UploadedFile["status"]) => {
    switch (status) {
      case "pending":
        return (
          <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case "queued":
        return (
          <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        );
      case "processing":
        return (
          <svg className="w-5 h-5 text-yellow-500 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        );
      case "completed":
        return (
          <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
          </svg>
        );
      case "failed":
        return (
          <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
          </svg>
        );
      default:
        return null;
    }
  };

  console.log(files)
  return (
    <>
      {files.length > 0 && (
        <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl border border-gray-100 p-8 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                Thumbnail Generation Status
              </h3>
              <p className="text-gray-500 mt-1">
                Track your file processing progress
              </p>
            </div>
            <div className="flex items-center space-x-6">
              <div className="text-center">
                <span className="text-2xl font-bold text-gray-800">
                  {files.length}
                </span>
                <p className="text-sm text-gray-500">Total Files</p>
              </div>
              <div className="flex space-x-3">
                {["pending", "queued", "processing", "completed", "failed"].map(
                  (status) => {
                    const count = files.filter(
                      (f) => f.status === status
                    ).length;
                    if (count === 0) return null;
                    return (
                      <div
                        key={status}
                        className="text-center px-3 py-2 bg-white rounded-xl shadow-sm border border-gray-100"
                      >
                        <span className="text-lg font-semibold text-gray-800">
                          {count}
                        </span>
                        <p className="text-xs text-gray-500 capitalize">
                          {status}
                        </p>
                      </div>
                    );
                  }
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {files.map((file) => (
              <div
                key={file.id}
                className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-2xl hover:border-gray-200 transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="relative aspect-video bg-gradient-to-br from-gray-50 to-gray-100">
                  {/* Original file preview */}
                  {file.type === "image" ? (
                    <img
                      src={`${import.meta.env.VITE_API_URL}${
                        file.originalFilePath
                      }`}
                      alt={file.originalFilePath}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <video
                      src={`${import.meta.env.VITE_API_URL}${
                        file.originalFilePath
                      }`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      controls
                    />
                  )}

                  {/* Status overlay */}
                  <div className="absolute top-3 left-3">
                    {getStatusBadge(file.status)}
                  </div>

                  {/* Remove button */}
                  <button
                    onClick={() => onRemoveFile(file.jobId || file.id)}
                    className="absolute top-3 right-3 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 transition-all duration-200 transform hover:scale-110 shadow-lg opacity-0 group-hover:opacity-100"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>

                  {/* File type indicator */}
                  <div className="absolute bottom-3 left-3 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
                    {file.type === "image" ? "🖼️ Image" : "🎥 Video"}
                  </div>
                </div>

                <div className="p-6">
                  <div className="mb-4">
                    <h4
                      className="font-semibold text-gray-800 truncate text-sm"
                      title={file.originalFileName}
                    >
                      {file.originalFileName}
                    </h4>

                    {/* Error message */}
                    {/* {file.status === "failed" && file.errorMessage && (
                      <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-xs text-red-600">
                          {file.errorMessage}
                        </p>
                      </div>
                    )} */}
                  </div>

                  {/* Thumbnail preview (when completed) */}
                  {file.status === "completed" && file.thumbnailUrl && (
                    <div className="mb-4 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100">
                      <p className="text-xs text-green-700 font-medium mb-2">
                        Generated Thumbnail:
                      </p>
                      <div className="relative">
                        <img
                          src={`${import.meta.env.VITE_API_URL}${
                            file.thumbnailUrl
                          }`}
                          alt="Thumbnail"
                          className="w-20 h-20 object-cover rounded-lg border-2 border-green-200 shadow-sm"
                        />
                        <div className="absolute -top-1 -right-1 bg-green-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                          ✓
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex space-x-2">
                    {file.status === "completed" && file.thumbnailUrl ? (
                      <button
                        onClick={() => handleDownload(file)}
                        className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-sm font-semibold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                      >
                        Download
                      </button>
                    ) : (
                      <div className="flex-1 flex items-center justify-center py-3 px-4 text-sm text-gray-600 bg-gray-50 rounded-xl border border-gray-200">
                        {getStatusIcon(file.status)}
                        <span className="ml-2 capitalize font-medium">
                          {file.status}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default FileStatusGrid;
