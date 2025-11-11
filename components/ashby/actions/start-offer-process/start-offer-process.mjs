import app from "../../ashby.app.mjs";

export default {
  key: "ashby-start-offer-process",
  name: "Start Offer Process",
  description: "Starts an offer process for a candidate. [See the documentation](https://developers.ashbyhq.com/reference/offerprocessstart)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    applicationId: {
      propDefinition: [
        app,
        "applicationId",
      ],
    },
  },
  async run({ $ }) {
    const {
      app,
      applicationId,
    } = this;

    const response = await app.startOfferProcess({
      $,
      data: {
        applicationId,
      },
    });

    $.export("$summary", `Successfully started offer process with ID \`${response.results?.id}\``);

    return response;
  },
};
