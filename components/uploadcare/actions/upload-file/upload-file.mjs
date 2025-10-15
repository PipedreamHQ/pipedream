import uploadcare from "../../uploadcare.app.mjs";
import constants from "../common/constants.mjs";

export default {
  name: "Upload File",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  key: "uploadcare-upload-file",
  description: "Upload a file. [See docs here](https://uploadcare.com/api-refs/upload-api/#operation/fromURLUpload)",
  type: "action",
  props: {
    uploadcare,
    sourceURL: {
      label: "Source URL",
      description: "Source URL of the file to fetch and upload",
      type: "string",
    },
    store: {
      label: "Store",
      description: "Determines if an uploaded file should be marked as temporary or permanent",
      type: "string",
      optional: true,
      options: constants.STORE_TYPES,
      default: "0",
    },
    checkURLDuplicates: {
      label: "Check URL Duplicates",
      description: "If the `Source URL` had already been fetched and uploaded previously, this request will return information about the already uploaded file.",
      type: "boolean",
      optional: true,
    },
    saveURLDuplicates: {
      label: "Save URL Duplicates",
      description: "Determines if the requested `Source URL` should be kept in the history of fetched/uploaded URLs. If the value is not defined explicitly, it is set to the value of the `Check URL Duplicates` parameter.",
      type: "boolean",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.uploadcare.uploadFileFromURL({
      $,
      data: {
        source_url: this.sourceURL,
        store: this.store,
        check_URL_duplicates: this.checkURLDuplicates,
        save_URL_duplicates: this.saveURLDuplicates,
      },
    });

    if (response) {
      $.export("$summary", `Successfully uploaded file with token ${response.token}`);
    }

    return response;
  },
};
