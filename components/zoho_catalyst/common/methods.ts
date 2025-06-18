import { getFileStreamAndMetadata } from "@pipedream/platform";
import FormData from "form-data";

export async function getImageFormData(imagePath: string) {
  const {
    stream, metadata,
  } = await getFileStreamAndMetadata(imagePath);

  const data = new FormData();
  data.append("image", stream, {
    filename: metadata.name,
    contentType: metadata.contentType,
    knownLength: metadata.size,
  });
  return data;
}
