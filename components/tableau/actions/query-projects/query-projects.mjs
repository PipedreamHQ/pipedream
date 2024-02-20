import tableau from "../../tableau.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "tableau-query-projects",
  name: "Query Projects",
  description: "Returns a list of projects on the specified site. [See the documentation](https://help.tableau.com/current/api/rest_api/en-us/REST/rest_api_ref_projects.htm)",
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
  },
  async run({ $ }) {
    const response = await this.tableau.listProjects({
      siteId: this.siteId,
    });

    $.export("$summary", "Successfully retrieved the list of projects");
    return response;
  },
};
