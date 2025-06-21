import FormData from "form-data";
import { getFileStreamAndMetadata } from "@pipedream/platform";

export async function getFileFormData(file) {
  const {
    stream, metadata,
  } = await getFileStreamAndMetadata(file);

  const data = new FormData();
  data.append("file", stream, {
    filename: metadata.name,
    contentType: metadata.contentType,
    knownLength: metadata.size,
  });
  return data;
}

export function fieldToString(obj) {
  return (typeof obj === "string")
    ? obj
    : JSON.stringify(obj);
}
