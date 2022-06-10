import gitlab from "../../gitlab.app.mjs";

export default {
  name: "Upload Project File",
  version: "0.0.1",
  key: "gitlab_upload-project-file",
  description: "Upload a file to a project",
  props: {
    gitlab,
    projectId: {
      propDefinition: [
        gitlab,
        "projectId",
      ],
    },
    file: {
      type: "string",
      label: "File to upload",
      description: "A valid base64-encoded string representing the file"
    },
    fileName: {
      type: "string",
      label: "The name of the file",
      description: "Example: `image.png` if an PNG image is passed to the `file` prop"
    }
  },
  type: "action",
  async run({ $ }) {
    const { data } = await this.gitlab.uploadFile(this.projectId, this.file, this.fileName)

    return data;
  },
};
