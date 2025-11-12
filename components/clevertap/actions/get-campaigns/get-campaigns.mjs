import app from "../../clevertap.app.mjs";

export default {
  key: "clevertap-get-campaigns",
  name: "Get Campaigns",
  description: "Get a list of campaigns within a specified date range. [See the documentation](https://developer.clevertap.com/docs/get-campaigns-api)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    from: {
      propDefinition: [
        app,
        "from",
      ],
    },
    to: {
      propDefinition: [
        app,
        "to",
      ],
    },
  },
  async run({ $ }) {
    const {
      app,
      from,
      to,
    } = this;

    const response = await app.getCampaigns({
      $,
      data: {
        from,
        to,
      },
    });

    $.export("$summary", "Successfully retrieved campaigns");

    return response;
  },
};
