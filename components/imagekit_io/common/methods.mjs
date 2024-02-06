import FormData from "form-data";
import fs from "fs";

export function getFileFormData(file) {
  const content = file.startsWith("/tmp")
    ? fs.createReadStream(file)
    : file;

  const data = new FormData();
  data.append("file", content);
  return data;
}

export function fieldToString(obj) {
  return (typeof obj === "string")
    ? obj
    : JSON.stringify(obj);
}
