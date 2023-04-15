import { getStorage } from "firebase-admin/storage";
import { v4 as uuidV4 } from "uuid";

export default async (targetFile: Buffer, contentType: string, filename: string) => {
  const storageRef = getStorage().bucket();

  const uuid = uuidV4();

  const file = storageRef.file(filename);

  await file
    .save(targetFile, {
      metadata: { contentType, firebaseStorageDownloadTokens: uuid },
    })
    .then(async () => await file.makePublic());

  return `https://firebasestorage.googleapis.com/v0/b/enotes-server.appspot.com/o/${encodeURIComponent(
    file.name
  )}?alt=media&token=${uuid}`;
};
