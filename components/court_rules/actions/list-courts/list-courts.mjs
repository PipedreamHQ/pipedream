import app from "../../court_rules.app.mjs";
import {
  COURT_STATUSES, DEFAULT_LIMIT,
} from "../../common/constants.mjs";
import { filterByText } from "../../common/utils.mjs";

export default {
  key: "court_rules-list-courts",
  name: "List Courts",
  description: "List the U.S. federal, state and local courts that Court Rules maps, with circuit, state, coverage status and roster size. Use it first to find the court ID (the `district_id` field) that **List Judges**, **Get Judge Rules**, **Search Filing Rules**, **List Court Holidays** and **Check Document Compliance** need. Courts with status `live` have rules available; `coming_soon` courts are mapped but have no rules yet. The full list has over a thousand courts, so filter by name, ID, state or circuit and keep the limit small. [See the documentation](https://docs.courtrules.app/api-reference/courts)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    nameFilter: {
      propDefinition: [
        app,
        "nameFilter",
      ],
      description: "Only return courts whose name, ID, state or circuit contains this text, ignoring case, e.g. `eastern district of new york`, `edny` or `california`.",
    },
    status: {
      type: "string",
      label: "Status",
      description: "Only return courts with this coverage status, e.g. `live`. Use `live` for courts that have rules available and `coming_soon` for courts that are mapped but have none yet.",
      options: COURT_STATUSES,
      optional: true,
    },
    limit: {
      propDefinition: [
        app,
        "limit",
      ],
    },
  },
  async run({ $ }) {
    const {
      courts, meta,
    } = await this.app.listCourts({
      $,
    });

    const byStatus = this.status
      ? courts.filter(({ status }) => status === this.status)
      : courts;
    const matches = filterByText({
      items: byStatus,
      text: this.nameFilter,
      fields: [
        "district_id",
        "name",
        "state",
        "circuit",
      ],
    });
    const returned = matches.slice(0, this.limit ?? DEFAULT_LIMIT);

    $.export("$summary", `Found ${matches.length} court(s)${matches.length > returned.length
      ? `, returning the first ${returned.length}`
      : ""}`);

    return {
      courts: returned,
      meta: {
        ...meta,
        matched: matches.length,
        returned: returned.length,
      },
    };
  },
};
