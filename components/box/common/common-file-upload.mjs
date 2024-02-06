import { ConfigurationError } from "@pipedream/platform";
import FormData from "form-data";
import utils from "./utils.mjs";

export function getFileUploadBody({
  file,
  createdAt,
  modifiedAt,
  fileName,
  parentId,
}) {
  const fileValidation = utils.isValidFile(file);
  if (!fileValidation) {
    throw new ConfigurationError("`file` must be a valid file path!");
  }
  const fileMeta = utils.getFileMeta(fileValidation);
  const fileContent = utils.getFileStream(fileValidation);
  const attributes = fileMeta.attributes;
  if (createdAt && utils.checkRFC3339(createdAt)) {
    attributes.content_created_at = createdAt;
  }
  if (modifiedAt && utils.checkRFC3339(modifiedAt)) {
    attributes.content_modified_at = modifiedAt;
  }
  if (fileName) {
    attributes.name = fileName;
  }
  if (parentId) {
    attributes.parent.id = parentId;
  }
  const data = new FormData();
  data.append("attributes", JSON.stringify(attributes));
  data.append("file", fileContent, {
    knownLength: fileMeta.size,
  });

  return data;
}
