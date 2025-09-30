import wise from "../../wise.app.mjs";

export default {
  name: "Get Balance",
  version: "0.0.5",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  key: "wise-get-balance",
  description: "Get a balance. [See docs here](https://api-docs.wise.com/api-reference/balance#get)",
  type: "action",
  props: {
    wise,
    profileId: {
      propDefinition: [
        wise,
        "profileId",
      ],
    },
    balanceId: {
      propDefinition: [
        wise,
        "balanceId",
        (c) => ({
          profileId: c.profileId,
        }),
      ],
    },
  },
  async run({ $ }) {
    const response = await this.wise.getBalance({
      $,
      profileId: this.profileId,
      balanceId: this.balanceId,
    });

    if (response) {
      $.export("$summary", `Successfully retrieved balance with id ${response.id}`);
    }

    return response;
  },
};
