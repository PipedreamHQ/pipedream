import { getFileStreamAndMetadata } from "@pipedream/platform";
import FormData from "form-data";
import constants from "./constants.mjs";

async function buildFormData(formData, data, parentKey) {
  if (data && typeof(data) === "object") {
    for (const key of Object.keys(data)) {
      await buildFormData(formData, data[key], parentKey && `${parentKey}[${key}]` || key);
    }
  } else if (data && constants.FILE_PROP_NAMES.some((prop) => parentKey.includes(prop))) {
    const {
      stream, metadata,
    } = await getFileStreamAndMetadata(data);
    formData.append(parentKey, stream, {
      contentType: metadata.contentType,
      knownLength: metadata.size,
      filename: metadata.name,
    });
  } else if (data) {
    formData.append(parentKey, (data).toString());
  }
}

async function getFormData(data) {
  try {
    const formData = new FormData();
    await buildFormData(formData, data);
    return formData;
  } catch (error) {
    console.log("FormData Error", error);
    throw error;
  }
}

function hasMultipartHeader(headers) {
  return headers
    && headers[constants.CONTENT_TYPE_KEY_HEADER]?.
      includes(constants.MULTIPART_FORM_DATA_VALUE_HEADER);
}

export default {
  getFormData,
  hasMultipartHeader,
};
