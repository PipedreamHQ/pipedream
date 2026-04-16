import acumbamail from "../../acumbamail.app.mjs";

export default {
  key: "acumbamail-get-campaigns",
  name: "Get Campaigns",
  description: "Get a list of campaigns. [See the documentation](https://acumbamail.com/en/apidoc/function/getCampaigns/)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    acumbamail,
  },
  async run({ $ }) {
    const response = await this.acumbamail.getCampaigns({
      $,
      params: {
        complete_json: true,
      },
    });
    $.export("$summary", "Successfully retrieved campaigns.");
    return response;
  },
};
