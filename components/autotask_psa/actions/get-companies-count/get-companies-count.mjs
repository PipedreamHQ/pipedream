import autotaskPsa from "../../autotask_psa.app.mjs";
import { FILTER_PROP_DESCRIPTION } from "../../common/constants.mjs";

export default {
  key: "autotask_psa-get-companies-count",
  name: "Get Companies Count",
  description:
    "Get count of companies in Autotask PSA. [See the documentation](https://www.autotask.net/help/developerhelp/Content/APIs/REST/REST_API_Home.htm)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    autotaskPsa,
    filter: {
      type: "object",
      label: "Filter",
      description: FILTER_PROP_DESCRIPTION,
    },
  },
  async run({ $ }) {
    const result = await this.autotaskPsa.queryEntityCount({
      $,
      entity: "Companies",
      data: this.filter,
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
