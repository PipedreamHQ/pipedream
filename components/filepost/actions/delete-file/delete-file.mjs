import filepost from "../../filepost.app.mjs";

export default {
  key: "filepost-delete-file",
  name: "Delete File",
  description: "Delete an uploaded file from FilePost by its ID. [See the documentation](https://filepost.dev/docs)",
  version: "0.1.0",
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
    const response = await this.filepost.deleteFile(this.fileId);
    $.export("$summary", `File ${this.fileId} deleted successfully.`);
    return response;
  },
};
