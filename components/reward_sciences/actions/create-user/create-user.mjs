import rewardSciences from "../../reward_sciences.app.mjs";

export default {
  key: "reward_sciences-create-user",
  name: "Create User",
  description: "Creates a new user in the Reward Sciences platform. [See the documentation](https://developers.rewardsciences.com/api/docs)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    rewardSciences,
    idp: {
      propDefinition: [
        rewardSciences,
        "idp",
      ],
    },
    identity: {
      propDefinition: [
        rewardSciences,
        "identity",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.rewardSciences.createUser({
      $,
      idp: this.idp,
      identity: this.identity,
    });
    $.export("$summary", `User successfully created with ID "${response.user_id}"`);
    return response;
  },
};
