// src/hooks/useFileUpload.ts
import { useState, useCallback, useEffect } from "react";
import useAuthentication from "./useAuthentication";
import type { ThumbnailJobResponse } from "@/store/action/auth.action";
import { type JobUpdate, connectSocket, disconnectSocket, subscribeToJobUpdates } from "@/utils/socket";
import { getToken } from "@/utils/authService";

export interface UploadedFile {
  id: string;
  originalFileName: string;
  originalFilePath: string;
  type: "image" | "video";
  status: "pending" | "queued" | "processing" | "completed" | "failed" | "uploading";
  thumbnailUrl?: string;
  jobId?: string;
}

const useFileUpload = () => {
  const { uploadFile } = useAuthentication();
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);

  useEffect(() => {
    const token = getToken();
    if (!token) return;

    const initSocket = async () => {
      try {
        await connectSocket(token);
        setSocketConnected(true);
      } catch (error) {
        console.error("Socket connection failed:", error);
      }
    };

    initSocket();

    return () => {
      disconnectSocket();
    };
  }, []);

  useEffect(() => {
    if (!socketConnected) return;

    const cleanupCallbacks: (() => void)[] = [];

    uploadedFiles.forEach((file) => {
      if (file.jobId && file.status !== "completed" && file.status !== "failed") {
        const unsubscribe = subscribeToJobUpdates(file.jobId, (update: JobUpdate) => {
          setUploadedFiles((prev) =>
            prev.map((f) =>
              f.jobId === update.jobId
                ? {
                    ...f,
                    status: update.status,
                    thumbnailUrl: update.thumbnailUrl || f.thumbnailUrl,
                  }
                : f
            )
          );
        });
        cleanupCallbacks.push(unsubscribe);
      }
    });
    

    return () => {
      cleanupCallbacks.forEach((cb) => cb());
    };
  }, [uploadedFiles, socketConnected]);

  const handleFileUpload = useCallback(
    async (files: FileList | File[]) => {
      setIsUploading(true);
      const fileArray = Array.from(files);
      const formData = new FormData();
      const newFiles: UploadedFile[] = [];

      // Build file metadata and form data
      for (const file of fileArray) {
        const isImage = file.type.startsWith("image/");
        const isVideo = file.type.startsWith("video/");

        if (!isImage && !isVideo) continue;

        const uniqueId = Date.now() + Math.random().toString(36).substring(2);

        newFiles.push({
          id: uniqueId,
          originalFileName: file.name,
          originalFilePath: file.name,
          type: isImage ? "image" : "video",
          status: "pending",
          jobId: "",
        });

        formData.append("files", file);
      }

      setUploadedFiles((prev) => [...prev, ...newFiles]);
      try {
        const response = await uploadFile(formData);
        const jobs = (response as { payload: ThumbnailJobResponse }).payload
          .jobs;

          setUploadedFiles((prev) => {
            const updatedFiles = prev.map((file) => {
              const matchingJob = jobs.find((job) => file.originalFileName === job.originalFileName);
              if (matchingJob && !file.jobId) {
                return {
                  ...file,
                  jobId: matchingJob.jobId,
                  originalFilePath: matchingJob.originalFilePath,
                  originalFileName: matchingJob.originalFileName,
                  status: matchingJob.status || "queued",
                  type: matchingJob.type || "image",
                };
              }
              return file;
            });
          
            return updatedFiles;
          });
      } catch (error) {
        console.error("Upload failed:", error);
        setUploadedFiles((prev) =>
          prev.map((file) => ({
            ...file,
            status: "failed",
            errorMessage: "Upload failed",
          }))
        );
      } finally {
        setIsUploading(false);
      }
    },
    [uploadFile]
  );

  const handleRemoveFile = useCallback((jobId: string) => {
    setUploadedFiles((prev) => prev.filter((file) => file.jobId !== jobId));
  }, []);

  return {
    uploadedFiles,
    isUploading,
    handleFileUpload,
    handleRemoveFile,
  };
};

export default useFileUpload;
