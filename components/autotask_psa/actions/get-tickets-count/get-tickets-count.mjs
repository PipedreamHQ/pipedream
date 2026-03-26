import autotaskPsa from "../../autotask_psa.app.mjs";
import { FILTER_PROP_DESCRIPTION } from "../../common/constants.mjs";

export default {
  key: "autotask_psa-get-tickets-count",
  name: "Get Tickets Count",
  description:
    "Get count of tickets in Autotask PSA. [See the documentation](https://www.autotask.net/help/DeveloperHelp/Content/APIs/REST/Entities/TicketsEntity.htm)",
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
      entity: "Tickets",
      data: this.filter,
    });
    const count =
      result?.queryCount ?? result?.count ?? result?.itemCount;
    $.export(
      "$summary",
      typeof count === "number"
        ? `Tickets count: ${count}`
        : "Retrieved tickets count from Autotask PSA",
    );
    return result;
  },
};
