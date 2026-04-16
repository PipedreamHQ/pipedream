import autotaskPsa from "../../autotask_psa.app.mjs";
import {
  formatListActionSummary,
  parseAutotaskQueryBody,
} from "../../common/utils.mjs";

export default {
  key: "autotask_psa-list-time-entries",
  name: "List Time Entries",
  description:
    "Query time entries from Autotask PSA. [See the documentation](https://www.autotask.net/help/DeveloperHelp/Content/APIs/REST/Entities/TimeEntriesEntity.htm)",
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
      entity: "TimeEntries",
      data,
    });
    $.export(
      "$summary",
      formatListActionSummary({
        total: result.items.length,
        resourceLabel: "time entries",
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
