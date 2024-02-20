import tableau from "../../tableau.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "tableau-create-project",
  name: "Create Project",
  description: "Creates a project on the specified site. You can also create project hierarchies by creating a project under the specified parent project on the site. [See the documentation](https://help.tableau.com/current/api/rest_api/en-us/REST/rest_api_ref_projects.htm#Create_Project)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    tableau,
    siteId: {
      propDefinition: [
        tableau,
        "siteId",
      ],
    },
    projectName: {
      propDefinition: [
        tableau,
        "projectName",
      ],
    },
    parentProjectId: {
      propDefinition: [
        tableau,
        "parentProjectId",
        (c) => ({
          optional: true,
        }),
      ],
    },
  },
  async run({ $ }) {
    const response = await this.tableau.createProject({
      siteId: this.siteId,
      projectName: this.projectName,
      parentProjectId: this.parentProjectId,
    });

    $.export("$summary", `Successfully created project '${this.projectName}' on site with ID '${this.siteId}'`);
    return response;
  },
};
