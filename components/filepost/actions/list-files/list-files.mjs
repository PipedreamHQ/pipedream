import filepost from "../../filepost.app.mjs";

export default {
  key: "filepost-list-files",
  name: "List Files",
  description: "Retrieve a list of files uploaded to your FilePost account. [See the documentation](https://filepost.dev/docs#list-files)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    filepost,
    page: {
      type: "integer",
      label: "Page",
      description: "Page number to retrieve.",
      default: 1,
      optional: true,
    },
    perPage: {
      type: "integer",
      label: "Per Page",
      description: "Number of results per page (max 100).",
      default: 50,
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.filepost.listFiles({
      $,
      params: {
        page: this.page,
        per_page: this.perPage,
      },
    });
    $.export("$summary", `Retrieved ${response.files?.length ?? 0} file(s).`);
    return response;
  },
};
