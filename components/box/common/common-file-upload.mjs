import FormData from "form-data";
import utils from "./utils.mjs";

export async function getFileUploadBody({
  file,
  createdAt,
  modifiedAt,
  fileName,
  parentId,
}) {
  const {
    fileMeta, fileContent,
  } = await utils.getFileData(file);
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
    contentType: fileMeta.contentType,
    knownLength: fileMeta.size,
    filename: attributes.name,
  });

  return data;
}
