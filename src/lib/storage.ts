import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "./firebase";

const allowedTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "application/pdf",
  "text/csv",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
]);

function safeFileName(name: string) {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 120);
}

export async function uploadCandidateFiles(candidateId: string, files: FileList | File[], folder: string) {
  const uploads = Array.from(files).map(async (file) => {
    if (!allowedTypes.has(file.type) && !file.name.endsWith(".xlsx") && !file.name.endsWith(".csv")) {
      throw new Error(`${file.name} is not an allowed file type.`);
    }

    const path = `candidates/${candidateId}/${folder}/${Date.now()}-${safeFileName(file.name)}`;
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, file, { contentType: file.type || undefined });
    return getDownloadURL(storageRef);
  });

  return Promise.all(uploads);
}
