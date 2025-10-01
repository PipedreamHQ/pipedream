import kingsumo from "../../kingsumo.app.mjs";

export default {
  key: "kingsumo-get-giveaway",
  name: "Get Giveaway",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  description: "Gets specified giveaway. [See the documentation](https://kingsumo.com/account/oauth)",
  type: "action",
  props: {
    kingsumo,
    giveawayId: {
      propDefinition: [
        kingsumo,
        "giveawayId",
      ],
    },
  },
  async run({ $ }) {
    const {
      kingsumo,
      giveawayId,
    } = this;

    const response = await kingsumo.getGiveaway({
      $,
      giveawayId,
    });

    $.export("$summary", `The giveaway with Id: ${giveawayId} was successfully fetched!`);
    return response;
  },
};
