import autotaskPsa from "../../autotask_psa.app.mjs";
import { parseAutotaskQueryBody } from "../../common/utils.mjs";

export default {
  key: "autotask_psa-get-companies-count",
  name: "Get Companies Count",
  description:
    "Get count of companies in Autotask PSA. [See the documentation](https://www.autotask.net/help/DeveloperHelp/Content/APIs/REST/Entities/CompaniesEntity.htm)",
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
      propDefinition: [
        autotaskPsa,
        "filter",
      ],
    },
  },
  async run({ $ }) {
    const data = parseAutotaskQueryBody(this.filter);
    const result = await this.autotaskPsa.queryEntityCount({
      $,
      entity: "Companies",
      data,
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
