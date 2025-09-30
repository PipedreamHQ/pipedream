import zohoProjects from "../../zoho_projects.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "zoho_projects-upload-file",
  name: "Upload File",
  description: "Add a document. [See the docs here](https://www.zoho.com/projects/help/rest-api/documents-api.html#alink3)",
  type: "action",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
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
    folderId: {
      propDefinition: [
        zohoProjects,
        "folderId",
        ({
          portalId, projectId,
        }) => ({
          portalId,
          projectId,
        }),
      ],
    },
    folderName: {
      type: "string",
      label: "Folder Name",
      description: "Name of the folder to create.",
    },
    folderIncludeFiles: {
      type: "boolean",
      label: "Folder Include Files",
      description: "If `true`, the new folder will become the parent folder for the files instead of the one in the URL by default",
      default: true,
    },
    uploadFile: {
      type: "string",
      label: "File Document",
      description: "File path of a file previously downloaded in Pipedream E.g. (`/tmp/my-file.txt`). [Download a file to the `/tmp` directory](https://pipedream.com/docs/code/nodejs/http-requests/#download-a-file-to-the-tmp-directory)",
    },
  },
  async run({ $ }) {
    const {
      portalId,
      folderId,
      folderName,
      folderIncludeFiles,
      uploadFile,
    } = this;

    const response =
      await this.zohoProjects.uploadFiles({
        $,
        headers: constants.MULTIPART_FORM_DATA_HEADERS,
        portalId,
        folderId,
        data: {
          service: "workdrive",
          folder_name: folderName,
          folder_include_files: folderIncludeFiles,
          upload_file: uploadFile,
        },
      });

    $.export("$summary", "Successfully uploaded a file to the project");

    return response;
  },
};
