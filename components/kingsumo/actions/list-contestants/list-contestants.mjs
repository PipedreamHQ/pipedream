import kingsumo from "../../kingsumo.app.mjs";

export default {
  key: "kingsumo-list-contestants",
  name: "List Contestants",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  description: "List contestants for specified giveaway. [See the documentation](https://kingsumo.com/account/oauth)",
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

    const response = await kingsumo.listContestants({
      $,
      giveawayId,
    });

    $.export("$summary", `The contestants of the giveaway with Id: ${giveawayId} was successfully fetched!`);
    return response;
  },
};
