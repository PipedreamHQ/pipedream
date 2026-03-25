import autotaskPsa from "../../autotask_psa.app.mjs";
import { QUERY_PROP_DESCRIPTION } from "../../common/constants.mjs";

export default {
  key: "autotask_psa-get-tickets-count",
  name: "Get Tickets Count",
  description:
    "Get the number of tickets matching an Autotask query. [See the documentation](https://www.autotask.net/help/developerhelp/Content/APIs/REST/REST_API_Home.htm)",
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
      entity: "Tickets",
      data: this.query,
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
