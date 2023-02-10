import app from "../../procore.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "procore-upload-document",
  name: "Upload Document",
  description: "Uploads a document to a project. [See the docs](https://developers.procore.com/reference/rest/v1/project-folders-and-files?version=1.0#create-project-file).",
  type: "action",
  version: "0.0.1",
  props: {
    app,
    companyId: {
      propDefinition: [
        app,
        "companyId",
      ],
    },
    projectId: {
      propDefinition: [
        app,
        "projectId",
        ({ companyId }) => ({
          companyId,
        }),
      ],
    },
    name: {
      type: "string",
      label: "Name",
      description: "The name of the document.",
      optional: true,
    },
    filePath: {
      type: "string",
      label: "File",
      description: "File path of a file previously downloaded in Pipedream E.g. (`/tmp/my-file.txt`). [Download a file to the `/tmp` directory](https://pipedream.com/docs/code/nodejs/http-requests/#download-a-file-to-the-tmp-directory)",
    },
  },
  methods: {
    createProjectFile(args = {}) {
      return this.app.create({
        path: "/files",
        ...args,
      });
    },
  },
  async run({ $: step }) {
    const {
      companyId,
      projectId,
      name,
      filePath,
    } = this;

    const response = await this.createProjectFile({
      step,
      headers: {
        ...this.app.companyHeader(companyId),
        ...constants.MULTIPART_FORM_DATA_HEADERS,
      },
      data: {
        file: {
          name,
          data: filePath,
        },
      },
      params: {
        project_id: projectId,
      },
    });

    step.export("$sumary", `Successfully uploaded document with ID ${response.id}`);

    return response;
  },
};
