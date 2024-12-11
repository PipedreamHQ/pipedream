import sailpoint from "../../sailpoint.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "sailpoint-upload-account-source-file",
  name: "Upload Account Source File",
  description: "Uploads a CSV-formatted account source file to IdentityNow. [See the documentation]()",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    sailpoint,
    sourceId: {
      propDefinition: [
        sailpoint,
        "sourceId",
      ],
    },
    csvAccountFile: {
      propDefinition: [
        sailpoint,
        "csvAccountFile",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.sailpoint.uploadCsvAccountFile();
    $.export("$summary", `Successfully uploaded CSV account file for source ${response.id} (${response.name})`);
    return response;
  },
};
