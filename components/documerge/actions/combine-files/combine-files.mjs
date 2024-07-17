import documerge from "../../documerge.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "documerge-combine-files",
  name: "Combine Files",
  description: "Merges multiple user-specified files into a single PDF or DOCX.",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    documerge,
    fileUrlsOrIds: documerge.propDefinitions.fileUrlsOrIds,
  },
  async run({ $ }) {
    const response = await this.documerge.mergeDocuments({
      data: {
        files: this.fileUrlsOrIds,
      },
    });
    $.export("$summary", "Successfully merged files");
    return response;
  },
};
