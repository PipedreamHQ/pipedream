import tableau from "../../tableau.app.mjs";

export default {
  key: "tableau-list-workbooks",
  name: "List Workbooks",
  description: "Returns a list of the workbooks on the specified site. [See the documentation](https://help.tableau.com/current/api/rest_api/en-us/REST/rest_api_ref_workbooks_and_views.htm#query_workbooks_for_site)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    tableau,
    siteId: {
      description: "The ID of the site to list workbooks for. Can use the **List Sites** action to get a list of sites.",
      propDefinition: [
        tableau,
        "siteId",
      ],
    },
    pageSize: {
      type: "integer",
      label: "Page Size",
      description: "The number of workbooks to return per page. The default is 100.",
      optional: true,
      default: 100,
      min: 1,
      max: 1000,
    },
    pageNumber: {
      type: "integer",
      label: "Page Number",
      description: "The page number to return. The default is 1.",
      optional: true,
      default: 1,
      min: 1,
    },
  },
  async run({ $ }) {
    const response = await this.tableau.listWorkbooks({
      $,
      siteId: this.siteId,
      params: {
        pageSize: this.pageSize,
        pageNumber: this.pageNumber,
      },
    });
    const count = response.workbooks?.workbook?.length ?? 0;
    $.export("$summary", `Successfully listed ${count} workbook${count === 1
      ? ""
      : "s"}`);
    return response;
  },
};
