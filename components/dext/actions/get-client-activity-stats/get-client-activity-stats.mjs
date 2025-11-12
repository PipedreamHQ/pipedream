import dext from "../../dext.app.mjs";

export default {
  key: "dext-get-client-activity-stats",
  name: "Get Client Activity Stats",
  description: "Retrieves the rolling annual and monthly-average Activity Stats for a particular client. [See the documentation](https://help.dext.com/en/s/article/api#api-endpoints)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    dext,
    client: {
      propDefinition: [
        dext,
        "client",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.dext.getActivityStats({
      clientId: this.client,
      $,
    });

    if (response) {
      $.export("$summary", `Successfully retrieved activity stats for client with ID ${this.client}`);
    }

    return response;
  },
};
