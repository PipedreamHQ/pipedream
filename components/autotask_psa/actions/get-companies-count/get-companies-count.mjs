import autotaskPsa from "../../autotask_psa.app.mjs";
import { QUERY_PROP_DESCRIPTION } from "../../common/constants.mjs";

export default {
  key: "autotask_psa-get-companies-count",
  name: "Get Companies Count",
  description:
    "Get the number of companies matching an Autotask query. [See the documentation](https://www.autotask.net/help/developerhelp/Content/APIs/REST/REST_API_Home.htm)",
  version: "0.0.2",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    autotaskPsa,
    query: {
      type: "object",
      label: "Query",
      description: QUERY_PROP_DESCRIPTION,
    },
  },
  async run({ $ }) {
    const result = await this.autotaskPsa.queryEntityCount({
      $,
      entity: "Companies",
      data: this.query,
    });
    const count =
      result?.queryCount ?? result?.count ?? result?.itemCount;
    $.export(
      "$summary",
      typeof count === "number"
        ? `Companies count: ${count}`
        : "Retrieved companies count from Autotask PSA",
    );
    return result;
  },
};
