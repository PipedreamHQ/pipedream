import amara from "../../amara.app.mjs";

export default {
  key: "amara-list-teams",
  name: "List teams",
  description: "List teams. [See the docs here](https://apidocs.amara.org/#list-teams)",
  type: "action",
  version: "0.0.1",
  props: {
    amara,
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
    const {
      limit,
      offset,
    } = this;

    const { objects: teams } = await this.amara.getTeams({
      $,
      limit,
      offset,
    });

    return teams;
  },
};
