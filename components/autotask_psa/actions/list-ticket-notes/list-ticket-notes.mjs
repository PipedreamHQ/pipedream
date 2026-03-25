import autotaskPsa from "../../autotask_psa.app.mjs";
import { FILTER_PROP_DESCRIPTION } from "../../common/constants.mjs";

export default {
  key: "autotask_psa-list-ticket-notes",
  name: "List Ticket Notes",
  description:
    "Query ticket notes from Autotask PSA. [See the documentation](https://www.autotask.net/help/developerhelp/Content/APIs/REST/REST_API_Home.htm)",
  version: "0.0.3",
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
    const result = await this.autotaskPsa.queryEntity({
      $,
      entity: "TicketNotes",
      data: this.filter,
    });
    const n = result?.items?.length;
    $.export(
      "$summary",
      typeof n === "number"
        ? `Retrieved ${n} ticket note(s)`
        : "Retrieved ticket notes from Autotask PSA",
    );
    return result;
  },
};
