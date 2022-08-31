import zohoProjects from "../../zoho_projects.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "zoho_projects-upload-file",
  name: "Upload File",
  description: "Add a document. [See the docs here](https://www.zoho.com/projects/help/rest-api/documents-api.html#alink3)",
  type: "action",
  version: "0.0.1",
  props: {
    zohoProjects,
    portalId: {
      propDefinition: [
        zohoProjects,
        "portalId",
      ],
    },
    projectId: {
      propDefinition: [
        zohoProjects,
        "projectId",
        ({ portalId }) => ({
          portalId,
        }),
      ],
    },
    uploadDoc: {
      type: "string",
      label: "File Document",
      description: "File path of a file previously downloaded in Pipedream E.g. (`/tmp/my-file.txt`). [Download a file to the `/tmp` directory](https://pipedream.com/docs/code/nodejs/http-requests/#download-a-file-to-the-tmp-directory)",
    },
    description: {
      type: "string",
      label: "Description",
      description: "Description of the document.",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      portalId,
      projectId,
      uploadDoc,
      description,
    } = this;

    const response =
      await this.zohoProjects.addDocument({
        $,
        headers: constants.MULTIPART_FORM_DATA_HEADERS,
        portalId,
        projectId,
        data: {
          uploaddoc: uploadDoc,
          description,
        },
      });

    $.export("$summary", "Successfully uploaded a file to the project");

    return response;
  },
};
