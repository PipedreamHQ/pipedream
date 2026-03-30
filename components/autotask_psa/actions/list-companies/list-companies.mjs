import autotaskPsa from "../../autotask_psa.app.mjs";
import { parseAutotaskQueryBody } from "../../common/utils.mjs";

export default {
  key: "autotask_psa-list-companies",
  name: "List Companies",
  description:
    "Query companies from Autotask PSA. [See the documentation](https://www.autotask.net/help/DeveloperHelp/Content/APIs/REST/Entities/CompaniesEntity.htm)",
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
    const result = await this.autotaskPsa.queryEntity({
      $,
      entity: "Companies",
      data,
    });
    const n = result?.items?.length;
    $.export(
      "$summary",
      typeof n === "number"
        ? `Retrieved ${n} companies`
        : "Retrieved companies from Autotask PSA",
    );
    return result;
  },
};
