import { getStorage } from "firebase-admin/storage";

export default async (filename: string) => {
  const storageRef = getStorage().bucket();

  storageRef.file(filename).delete();
};
