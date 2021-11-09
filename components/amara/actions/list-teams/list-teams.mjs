import common from "../common.mjs";

const { amara } = common.props;

export default {
  ...common,
  key: "amara-list-teams",
  name: "List teams",
  description: "List teams. [See the docs here](https://apidocs.amara.org/#list-teams)",
  type: "action",
  version: "0.0.1",
  props: {
    ...common.props,
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
