import autotaskPsa from "../../autotask_psa.app.mjs";
import {
  formatListActionSummary,
  parseAutotaskQueryBody,
} from "../../common/utils.mjs";

export default {
  key: "autotask_psa-list-contracts",
  name: "List Contracts",
  description:
    "Query contracts from Autotask PSA. [See the documentation](https://www.autotask.net/help/DeveloperHelp/Content/APIs/REST/Entities/ContractsEntity.htm)",
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
    const result = await this.autotaskPsa.queryEntityAllPages({
      $,
      entity: "Contracts",
      data,
    });
    $.export(
      "$summary",
      formatListActionSummary({
        total: result.items.length,
        resourceLabel: "contract(s)",
        stoppedEarly: result.paginationStoppedEarly,
        maxPages: result.maxPages,
      }),
    );
    return {
      items: result.items,
      pageDetails: result.pageDetails,
      paginationStoppedEarly: result.paginationStoppedEarly,
    };
  },
};
