import app from "../../unthread.app.mjs";

export default {
  key: "unthread-update-customer",
  name: "Update Customer",
  description: "Update a Customer. [See the documentation](https://docs.unthread.io/api-introduction/using-api#update-customer)",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    customerId: {
      propDefinition: [
        app,
        "customerId",
      ],
    },
    slackChannelId: {
      propDefinition: [
        app,
        "slackChannelId",
      ],
      optional: true,
    },
    name: {
      propDefinition: [
        app,
        "name",
      ],
      optional: true,
    },
    emailDomains: {
      propDefinition: [
        app,
        "emailDomains",
      ],
      optional: true,
    },
    disableAutomatedTicketing: {
      propDefinition: [
        app,
        "disableAutomatedTicketing",
      ],
    },
    slackTeamId: {
      propDefinition: [
        app,
        "slackTeamId",
      ],
    },
    defaultTriageChannelId: {
      propDefinition: [
        app,
        "defaultTriageChannelId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.updateCustomer({
      $,
      customerId: this.customerId,
      data: {
        slackChannelId: this.slackChannelId,
        name: this.name,
        emailDomains: this.emailDomains,
        disableAutomatedTicketing: this.disableAutomatedTicketing,
        slackTeamId: this.slackTeamId,
        defaultTriageChannelId: this.defaultTriageChannelId,
      },
    });

    $.export("$summary", `Successfully updated Customer with ID '${response.id}'`);

    return response;
  },
};
