import { createReadStream } from "fs";
import FormData from "form-data";
import constants from "./constants.mjs";

function buildFormData(formData, data, parentKey) {
  if (data && typeof(data) === "object") {
    Object.keys(data)
      .forEach((key) => {
        buildFormData(formData, data[key], parentKey && `${parentKey}[${key}]` || key);
      });

  } else if (data && constants.FILE_PROP_NAMES.some((prop) => parentKey.includes(prop))) {
    formData.append(parentKey, createReadStream(data));

  } else if (data) {
    formData.append(parentKey, (data).toString());
  }
}

function getFormData(data) {
  try {
    const formData = new FormData();
    buildFormData(formData, data);
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
