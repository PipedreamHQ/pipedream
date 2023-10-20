import gist from "../../gist.app.mjs";

export default {
  key: "gist-subscribe-contact-to-campaign",
  name: "Subscribe Contact To Campaign",
  description: "This Action subscribes a contact to a campaign. [See docs](https://developers.getgist.com/api/#subscribe-a-contact-to-campaign)",
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
      optional: true,
    },
    userId: {
      propDefinition: [
        gist,
        "userId",
      ],
      optional: true,
    },
    startingEmailIndex: {
      label: "Starting Email Index",
      description: "The index of the email to send first. Defaults to 0. Required if no User Id",
      type: "integer",
      optional: true,
    },
    reactivateIfRemoved: {
      label: "Reactive If Removed",
      description: "Sending true will force subscribe the contact even if they unsubscribed from the campaign earlier.",
      type: "boolean",
      optional: true,
    },
  },
  async run({ $ }) {
    const data = {
      id: this.campaignId.value,
      email: this.email,
      user_id: this.userId,
      starting_email_index: this.startingEmailIndex,
      reactivate_if_removed: this.reactivateIfRemoved,
    };

    const response = await this.gist.addOrRemoveContactInCampaign({
      $,
      data,
    });

    $.export("$summary", `Successfully subscribed contact ${this.email || this.userId} to campaign ${this.campaignId.label}`);

    return response;
  },
};
