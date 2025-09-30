import app from "../../mailmodo.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "mailmodo-trigger-campaign",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  name: "Trigger Campaign",
  description: "Allows to trigger campaigns with personalization parameter added to the email template. [See the docs here](https://www.mailmodo.com/developers/4c44d1b19765f-send-campaign-email/)",
  props: {
    app,
    campaignId: {
      propDefinition: [
        app,
        "campaignId",
      ],
    },
    email: {
      propDefinition: [
        app,
        "email",
      ],
    },
    subject: {
      type: "string",
      label: "Subject",
      description: "Subject",
      optional: true,
    },
    data: {
      type: "object",
      label: "Data",
      description: "Personalization parameters sent inside the `data` block will be added / update as user attributed against the contact profile. e.g. `{\"first_name\": \"John\"}`",
      optional: true,
    },
    campaignData: {
      type: "object",
      label: "Campaign Data",
      description: "Personalization parameters sent inside the `campaign data` block will not be added / update against the contact profile i.e. they works as transient variables.",
      optional: true,
    },
  },
  async run ({ $ }) {
    const pairs = {
      campaignData: "campaign_data",
    };
    const {
      campaignId, ...data
    } = utils.extractProps(this, pairs);
    const resp = await this.app.triggerCampaign({
      $,
      campaignId,
      data,
    });
    $.export("$summary", resp.message);
    return resp;
  },
};
