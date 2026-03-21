import app from "../../servicem8.app.mjs";
import {
  buildListParams, listQueryPropDefinitions,
} from "../common/query.mjs";

export default {
  key: "servicem8-list-companies",
  name: "List Companys",
  description: "List Company records with optional filtering. [See the documentation](https://developer.servicem8.com/reference/listcompanies)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    servicem8: app,
    ...listQueryPropDefinitions,
  },
  async run({ $ }) {
    const params = buildListParams({
      filter: this.filter,
      sort: this.sort,
      cursor: this.cursor,
    });
    const response = await this.servicem8.listResource({
      $,
      resource: "company",
      params,
    });
    $.export("$summary", "Successfully retrieved Company records");
    return response;
  },
};
