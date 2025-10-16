import app from "../../smslink_nc.app.mjs";

export default {
  key: "smslink_nc-delete-sms-campaign",
  name: "Delete SMS Campaign",
  description: "Delete an existing SMS campaign. [See the documentation](https://api.smslink.nc/api/documentation)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    campaignId: {
      propDefinition: [
        app,
        "campaignId",
      ],
    },
  },
  methods: {
    deleteCampaign({
      campaignId, ...args
    } = {}) {
      return this.app.delete({
        path: `/sms-campaign/${campaignId}`,
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      deleteCampaign,
      campaignId,
    } = this;

    await deleteCampaign({
      $,
      campaignId,
      params: {
        by: "id",
      },
    });

    $.export("$summary", "Successfully deleted SMS campaign.");
    return {
      sucess: true,
    };
  },
};
