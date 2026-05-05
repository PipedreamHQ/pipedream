import tableau from "../../tableau.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

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
    filter: {
      type: "string",
      label: "Filter",
      description: "An expression that lets you specify a subset of workbooks to return. You can filter on predefined fields such as name, tags, and createdAt. You can include multiple filter expressions. For more information, see [Filtering and Sorting](https://help.tableau.com/current/api/rest_api/en-us/REST/rest_api_concepts_filtering_and_sorting.htm).",
      optional: true,
    },
    sort: {
      type: "string",
      label: "Sort",
      description: "An expression that lets you specify the order in which workbook information is returned. If you do not specify a sort expression, the sort order of the information that's returned is undefined. For more information, see [Filtering and Sorting](https://help.tableau.com/current/api/rest_api/en-us/REST/rest_api_concepts_filtering_and_sorting.htm).",
      optional: true,
    },
    field: {
      type: "string",
      label: "Field",
      description: "An expression that lets you specify the set of available fields to return. You can qualify the return values based upon predefined keywords such as _all_ or _default_, and you can specify individual fields for the workbooks or other supported resources. You can include multiple field expressions in a request. For more information, see [Using Fields in the REST API](https://help.tableau.com/current/api/rest_api/en-us/REST/rest_api_concepts_fields.htm).",
      optional: true,
    },
    pageSize: {
      type: "integer",
      label: "Page Size",
      description: "The number of workbooks to return per page. The default is 100. Maximum is 1000.",
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
    let response;
    try {
      response = await this.tableau.listWorkbooks({
        $,
        siteId: this.siteId,
        params: {
          filter: this.filter,
          sort: this.sort,
          field: this.field,
          pageSize: this.pageSize,
          pageNumber: this.pageNumber,
        },
      });
    } catch (error) {
      if (error?.message?.includes("Invalid page number")) {
        throw new ConfigurationError("Page number invalid.");
      }
    }
    const count = response.workbooks?.workbook?.length ?? 0;
    $.export("$summary", `Successfully listed ${count} workbook${count === 1
      ? ""
      : "s"}`);
    return response;
  },
};
