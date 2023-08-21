import fs from "fs";
import FormData from "form-data";

export function getImageFormData(imagePath: string) {
  const content = fs.createReadStream(imagePath.startsWith("/tmp")
    ? imagePath
    : `/tmp/${imagePath}`.replace(/\/\//g, "/"));

  const data = new FormData();
  data.append("image", content);
  return data;
}
