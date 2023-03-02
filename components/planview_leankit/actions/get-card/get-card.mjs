import planview_leankit from "../../planview_leankit.app.mjs";

export default {
  key: "planview_leankit-get-card",
  name: "Get Card",
  version: "0.0.1",
  description: "Get card details by card id. [See the docs here](https://success.planview.com/Planview_AgilePlace/AgilePlace_API/01_v2/card/get)",
  type: "action",
  props: {
    planview_leankit,
    cardId: {
      propDefinition: [
        planview_leankit,
        "cardId",
      ],
    },
  },
  async run({ $ }) {
    const {
      planview_leankit,
      cardId,
    } = this;
    const response = await planview_leankit.getCard({
      $,
      cardId,
    });

    $.export("$summary", `The card with id ${response.id} was successfully fetched!`);
    return response;
  },
};
