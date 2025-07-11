import app from "../../clevertap.app.mjs";

export default {
  key: "clevertap-get-campaigns",
  name: "Get Campaigns",
  description: "Get a list of campaigns within a specified date range. [See the documentation](https://developer.clevertap.com/docs/get-campaigns-api)",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    from: {
      type: "string",
      label: "From Date",
      description: "Start of the date range for which you want to retrieve campaigns. Use `YYYYMMDD` format.",
    },
    to: {
      type: "string",
      label: "To Date",
      description: "End of the date range for which you want to retrieve campaigns. Use `YYYYMMDD` format.",
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
