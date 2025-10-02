import app from "../../unthread.app.mjs";

export default {
  key: "unthread-create-customer",
  name: "Create Customer",
  description: "Create a new Customer. [See the documentation](https://docs.unthread.io/api-introduction/using-api#create-customer)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    slackChannelId: {
      propDefinition: [
        app,
        "slackChannelId",
      ],
    },
    name: {
      propDefinition: [
        app,
        "name",
      ],
    },
    emailDomains: {
      propDefinition: [
        app,
        "emailDomains",
      ],
    },
  },
  async run({ $ }) {
    const {
      app, ...data
    } = this;
    const response = await app.createCustomer({
      $,
      data,
    });

    $.export("$summary", `Successfully created Customer with ID '${response.id}'`);

    return response;
  },
};
