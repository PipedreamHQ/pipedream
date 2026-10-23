import app from "../../court_rules.app.mjs";
import { filterByText } from "../../common/utils.mjs";

export default {
  key: "court_rules-list-judges",
  name: "List Judges",
  description: "List the judges on a court's roster (and, in some state courts, departments or courtrooms) with their slug, type, chambers and whether Court Rules holds their own rules (`has_rules`). Use **List Courts** first to find the court ID. Use the `slug` of a judge with **Get Judge Rules** or **Search Filing Rules**. Large rosters can be long, so filter by name. [See the documentation](https://docs.courtrules.app/api-reference/judges)",
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
    districtId: {
      propDefinition: [
        app,
        "districtId",
      ],
    },
    nameFilter: {
      propDefinition: [
        app,
        "nameFilter",
      ],
      description: "Only return judges whose name or slug contains this text, ignoring case, e.g. `garaufis`.",
    },
  },
  async run({ $ }) {
    const response = await this.app.listJudges({
      $,
      params: {
        district_id: this.districtId,
      },
    });

    const judges = filterByText({
      items: response.judges,
      text: this.nameFilter,
      fields: [
        "name",
        "slug",
      ],
    });

    $.export("$summary", `Found ${judges.length} judge(s) in ${this.districtId}`);

    return {
      ...response,
      judges,
      meta: {
        ...response.meta,
        matched: judges.length,
      },
    };
  },
};
