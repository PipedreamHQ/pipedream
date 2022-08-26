import zohoProjects from "../../zoho_projects.app.mjs";

export default {
  key: "zoho_projects-upload-file",
  name: "Upload File",
  description: "Uploads a document to the project. [See the docs here](https://www.zoho.com/projects/help/rest-api/documents-api.html#alink4)",
  type: "action",
  version: "0.0.1",
  props: {
    zohoProjects,
  },
  async run() {},
};
