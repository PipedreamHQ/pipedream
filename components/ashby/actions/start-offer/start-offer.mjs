import app from "../../ashby.app.mjs";

export default {
  key: "ashby-start-offer",
  name: "Start Offer",
  description: "Starts an offer and returns an offer form instance that can be filled out and submitted. [See the documentation](https://developers.ashbyhq.com/reference/offerstart)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    offerProcessId: {
      propDefinition: [
        app,
        "offerProcessId",
      ],
    },
  },
  async run({ $ }) {
    const {
      app,
      offerProcessId,
    } = this;

    const response = await app.startOffer({
      $,
      data: {
        offerProcessId,
      },
    });

    $.export("$summary", `Successfully started offer with ID \`${response.results?.id}\``);

    return response;
  },
};
