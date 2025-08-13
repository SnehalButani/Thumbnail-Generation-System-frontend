import * as Yup from "yup";

const FILE_SIZE_LIMIT = 50 * 1024 * 1024;
const SUPPORTED_FORMATS = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "video/mp4",
  "video/avi",
  "video/quicktime" 
];

export const fileUploadSchema = Yup.array()
  .of(
    Yup.mixed<File>()
      .test("fileFormat", "Unsupported file type", (file) =>
        file ? SUPPORTED_FORMATS.includes(file.type) : false
      )
      .test("fileSize", "File too large", (file) =>
        file ? file.size <= FILE_SIZE_LIMIT : false
      )
  )
  .max(5, "You can upload up to 5 files only")
  .required("Please select at least one file");
