import { useEffect } from "react";
import useFileUpload from "@/hooks/useFileUpload";
import { getToken } from "@/utils/authService";
import { connectSocket, disconnectSocket } from "@/utils/socket";
import FileStatusGrid from "./FileStatusGrid";
import FileUploadArea from "./FileUploadArea";

const Dashboard = () => {
  const { handleFileUpload, handleRemoveFile, isUploading, uploadedFiles } = useFileUpload();

  useEffect(() => {
    const token = getToken();
    if (token) {
      connectSocket(token);
    }
    
    return () => {
      disconnectSocket();
    };
  }, []);


  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Thumbnail Generation Dashboard</h2>
        <p className="text-gray-600">Upload images and videos to generate thumbnails in real-time</p>
      </div>

      {/* Upload Section */}
      <FileUploadArea isUploading={isUploading} onFileUpload={handleFileUpload} />

      {/* Files Status Section */}
      <FileStatusGrid files={uploadedFiles} onRemoveFile={handleRemoveFile} />

      {/* Empty State */}
      {uploadedFiles.length === 0 && !isUploading && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <div className="mx-auto w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-800 mb-2">No files uploaded yet</h3>
          <p className="text-gray-500">Upload your first image or video to generate thumbnails</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;