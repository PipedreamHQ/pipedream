import app from "../../linkupapi.app.mjs";

export default {
  type: "action",
  key: "linkupapi-send-message",
  name: "Send Message",
  description: "Send a message to a LinkedIn profile. [See the documentation](https://docs.linkupapi.com/api-reference/linkup/Messages/send)",
  version: "0.0.3",
  props: {
    app,
    // eslint-disable-next-line pipedream/props-label, pipedream/props-description
    info: {
      type: "alert",
      alertType: "info",
      content: "Make sure you previously connected to the LinkedIn profile you want to send a message to.",
    },
    loginToken: {
      propDefinition: [
        app,
        "loginToken",
      ],
      optional: true,
    },
    accountId: {
      propDefinition: [
        app,
        "accountId",
      ],
    },
    linkedinUrl: {
      propDefinition: [
        app,
        "linkedinUrl",
      ],
    },
    messageText: {
      propDefinition: [
        app,
        "messageText",
      ],
    },
    country: {
      propDefinition: [
        app,
        "country",
      ],
    },
  },
  annotations: {
    readOnlyHint: false,
    destructiveHint: true,
    openWorldHint: true,
    idempotentHint: false,
  },
  async run({ $ }) {
    const {
      app,
      linkedinUrl,
      messageText,
      loginToken,
      accountId,
      country,
    } = this;

    if (accountId) {
      const response = await app.postV2({
        $,
        path: "/messages",
        data: {
          account_id: accountId,
          action: "send",
          params: {
            profile_url: linkedinUrl,
            message_text: messageText,
          },
        },
      });

      $.export("$summary", "Successfully sent message request");

      return response;
    }

    try {
      const response = await app.sendMessage({
        $,
        data: {
          linkedin_url: linkedinUrl,
          message_text: messageText,
          login_token: loginToken,
          country,
        },
      });

      $.export("$summary", "Successfully sent message request");

      return response;
    } catch (error) {
      if (error.response?.data?.data === "Invalid parameter") {
        throw new Error("Invalid parameter. Make sure you previously connected to the LinkedIn profile you want to send a message to.");
      }
      throw error;
    }
  },
};
