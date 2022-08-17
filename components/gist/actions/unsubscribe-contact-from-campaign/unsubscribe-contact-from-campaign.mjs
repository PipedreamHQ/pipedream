import gist from "../../gist.app.mjs";

export default {
  ...gist,
  key: "gist-unsubscribe-contact-from-campaign",
  name: "Unsubscribe Contact From Campaign",
  description: "This Action unsubscribes a contact to a campaign. [See docs](https://developers.getgist.com/api/#unsubscribe-a-contact-from-campaign)",
  type: "action",
  version: "0.0.1",
  props: {
    gist,
    campaignId: {
      propDefinition: [
        gist,
        "campaignId",
      ],
    },
    email: {
      propDefinition: [
        gist,
        "email",
      ],
    },
    userId: {
      propDefinition: [
        gist,
        "userId",
      ],
    },
  },
  async run({ $ }) {
    const data = {
      id: this.campaignId.value,
      email: this.email,
      user_id: this.userId,
      unsubscribed: true,
    };

    const response = await this.gist.addOrRemoveContactInCampaign({
      $,
      data,
    });

    $.export("$summary", `Successfully unsubscribed contact ${this.email || this.userId} from campaign ${this.campaignId.label}`);

    return response;
  },
};
