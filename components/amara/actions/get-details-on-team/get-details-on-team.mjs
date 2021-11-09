import common from "../common.mjs";

const { amara } = common.props;

export default {
  ...common,
  key: "amara-get-details-on-team",
  name: "Get details on a team",
  description: "Get details on a team. [See the docs here](https://apidocs.amara.org/#get-details-on-a-team)",
  type: "action",
  version: "0.0.1",
  props: {
    ...common.props,
    teamId: {
      propDefinition: [
        amara,
        "team",
      ],
    },
  },
  async run({ $ }) {
    return await this.amara.getTeam({
      $,
      teamId: this.teamId,
    });
  },
};
