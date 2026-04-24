import filepost from "../../filepost.app.mjs";

export default {
  key: "filepost-get-file",
  name: "Get File",
  description: "Retrieve details of a specific file by its ID. [See the documentation](https://filepost.dev/docs#get-file)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    filepost,
    fileId: {
      propDefinition: [
        filepost,
        "fileId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.filepost.getFile({
      $,
      fileId: this.fileId,
    });
    $.export("$summary", `Retrieved file: ${response.url}`);
    return response;
  },
};
