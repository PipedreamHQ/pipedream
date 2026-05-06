import app from "../../lever_oauth.app.mjs";

export default {
  key: "lever_oauth-list-files",
  name: "List Files",
  description:
    "Returns all files attached to an opportunity (resumes, cover letters, portfolios, etc.)."
    + " Use this when asked what documents a candidate has submitted or to find a resume ID before calling **Get Resume** for parsed resume data."
    + " Each file record includes the file ID, name, extension, size, and upload timestamp."
    + " [See the documentation](https://hire.lever.co/developer/documentation#list-all-opportunity-file-actions)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    opportunityId: {
      type: "string",
      label: "Opportunity ID",
      description: "The ID of the opportunity whose files to list. Use **Search Opportunities** to find opportunity IDs.",
    },
  },
  async run({ $ }) {
    const response = await this.app.listFiles(this.opportunityId, {
      $,
    });
    const files = response.data ?? response;
    $.export("$summary", `Retrieved ${files.length} file${files.length === 1
      ? ""
      : "s"}`);
    return files;
  },
};
