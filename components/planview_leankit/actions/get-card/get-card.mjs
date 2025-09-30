import planviewLeankit from "../../planview_leankit.app.mjs";

export default {
  key: "planview_leankit-get-card",
  name: "Get Card",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  description: "Get card details by card id. [See the docs here](https://success.planview.com/Planview_AgilePlace/AgilePlace_API/01_v2/card/get)",
  type: "action",
  props: {
    planviewLeankit,
    cardId: {
      propDefinition: [
        planviewLeankit,
        "cardId",
      ],
    },
  },
  async run({ $ }) {
    const {
      planviewLeankit,
      cardId,
    } = this;
    const response = await planviewLeankit.getCard({
      $,
      cardId,
    });

    $.export("$summary", `The card with id ${response.id} was successfully fetched!`);
    return response;
  },
};
