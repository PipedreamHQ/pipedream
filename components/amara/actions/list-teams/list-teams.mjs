import amara from "../../amara.app.mjs";
import utils from "../common/utils.mjs";

export default {
  key: "amara-list-teams",
  name: "List Teams",
  description: "List teams. [See the docs here](https://apidocs.amara.org/#list-teams)",
  type: "action",
  version: "0.0.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
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
    let teams = [];

    const resourcesStream = await this.amara.getResourcesStream({
      resourceFn: this.amara.getTeams,
      resourceFnArgs: {
        $,
      },
      offset,
      limit,
      max: this.max,
    });

    for await (const team of resourcesStream) {
      teams.push(team);
    }

    // eslint-disable-next-line multiline-ternary
    $.export("$summary", `Successfully fetched ${teams.length} ${teams.length === 1 ? "team" : "teams"}`);

    return teams;
  },
};
