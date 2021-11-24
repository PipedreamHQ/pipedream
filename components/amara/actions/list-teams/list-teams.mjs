import amara from "../../amara.app.mjs";
import utils from "../../utils.mjs";

export default {
  key: "amara-list-teams",
  name: "List Teams",
  description: "List teams. [See the docs here](https://apidocs.amara.org/#list-teams)",
  type: "action",
  version: "0.0.1",
  props: {
    amara,
    max: {
      propDefinition: [
        amara,
        "max",
      ],
    },
    limit: {
      propDefinition: [
        amara,
        "limit",
      ],
    },
    offset: {
      propDefinition: [
        amara,
        "offset",
      ],
    },
  },
  async run({ $ }) {
    const limit = utils.emptyStrToUndefined(this.limit);
    const offset = utils.emptyStrToUndefined(this.offset);

    const { resources: teams } = await this.amara.paginateResources({
      resourceFn: this.amara.getTeams,
      resourceFnArgs: {
        $,
      },
      offset,
      limit,
      max: this.max,
    });

    // eslint-disable-next-line multiline-ternary
    $.export("$summary", `Successfully fetched ${teams.length} ${teams.length === 1 ? "team" : "teams"}`);

    return teams;
  },
};
