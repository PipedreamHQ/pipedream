import { ConfigurationError } from "@pipedream/platform";
import app from "../../braze.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "braze-send-message",
  name: "Send A Message",
  description: "Sends a message to a user. [See the docs](https://www.braze.com/docs/api/endpoints/messaging/send_messages/post_send_messages/).",
  type: "action",
  version: "0.0.1",
  props: {
    app,
    userAliasName: {
      type: "string",
      label: "User Alias Name",
      description: "The name of the user alias. [See the docs here](https://www.braze.com/docs/api/objects_filters/user_alias_object#user-alias-object-specification).",
    },
    userAliasLabel: {
      type: "string",
      label: "User Alias Label",
      description: "The label of the user alias. [See the docs here](https://www.braze.com/docs/api/objects_filters/user_alias_object#user-alias-object-specification).",
    },
    showApplePushProps: {
      type: "boolean",
      label: "Show Apple Push Props",
      description: "Show Apple Push Props",
      optional: true,
      reloadProps: true,
    },
    showAndroidPushProps: {
      type: "boolean",
      label: "Show Android Push Props",
      description: "Show Android Push Props",
      optional: true,
      reloadProps: true,
    },
    showKindlePushProps: {
      type: "boolean",
      label: "Show Kindle Push Props",
      description: "Show Kindle Push Props",
      optional: true,
      reloadProps: true,
    },
    showWebPushProps: {
      type: "boolean",
      label: "Show Web Push Props",
      description: "Show Web Push Props",
      optional: true,
      reloadProps: true,
    },
    showEmailProps: {
      type: "boolean",
      label: "Show Email Props",
      description: "Show Email Props",
      optional: true,
      reloadProps: true,
    },
    showWebhookProps: {
      type: "boolean",
      label: "Show Webhook Props",
      description: "Show Webhook Props",
      optional: true,
      reloadProps: true,
    },
    showContentCardProps: {
      type: "boolean",
      label: "Show Content Card Props",
      description: "Show Content Card Props",
      optional: true,
      reloadProps: true,
    },
    showSmsProps: {
      type: "boolean",
      label: "Show SMS Props",
      description: "Show SMS Props",
      optional: true,
      reloadProps: true,
    },
  },
  async additionalProps() {
    return {
      ...this.addProps(this.showApplePushProps, {
        applePushAlert: {
          type: "string",
          label: "Apple Push Alert",
          description: "The notification message. [See the docs here](https://www.braze.com/docs/api/objects_filters/messaging/apple_object/).",
          optional: true,
        },
      }),
      ...this.addProps(this.showAndroidPushProps, {
        androidPushTitle: {
          type: "string",
          label: "Android Push Title",
          description: "The title that appears in the notification drawer. [See the docs here](https://www.braze.com/docs/api/objects_filters/messaging/android_object/).",
          optional: true,
        },
        androidPushAlert: {
          type: "string",
          label: "Android Push Alert",
          description: "The notification message. [See the docs here](https://www.braze.com/docs/api/objects_filters/messaging/android_object/).",
          optional: true,
        },
      }),
      ...this.addProps(this.showKindlePushProps, {
        kindlePushTitle: {
          type: "string",
          label: "Kindle Push Title",
          description: "The title that appears in the notification drawer. [See the docs here](https://www.braze.com/docs/api/objects_filters/messaging/kindle_and_fireos_object/).",
          optional: true,
        },
        kindlePushAlert: {
          type: "string",
          label: "Kindle Push Alert",
          description: "The notification message. [See the docs here](https://www.braze.com/docs/api/objects_filters/messaging/kindle_and_fireos_object/).",
          optional: true,
        },
      }),
      ...this.addProps(this.showWebPushProps, {
        webPushTitle: {
          type: "string",
          label: "Web Push Title",
          description: "The title that appears in the notification drawer. [See the docs here](https://www.braze.com/docs/api/objects_filters/messaging/web_objects/).",
          optional: true,
        },
        webPushAlert: {
          type: "string",
          label: "Web Push Alert",
          description: "The notification message. [See the docs here](https://www.braze.com/docs/api/objects_filters/messaging/web_objects/).",
          optional: true,
        },
      }),
      ...this.addProps(this.showEmailProps, {
        emailAppId: {
          type: "string",
          label: "Email App ID",
          description: "The ID of the email app. [See the docs here](https://www.braze.com/docs/api/objects_filters/messaging/email_object/) and [here](https://www.braze.com/docs/api/identifier_types/).",
          optional: true,
        },
        emailFrom: {
          type: "string",
          label: "Email From",
          description: "The email address that the email is sent from. Valid email address in the format `Display Name <email@address.com>` [See the docs here](https://www.braze.com/docs/api/objects_filters/messaging/email_object/).",
          optional: true,
        },
        emailBody: {
          type: "string",
          label: "Email Body",
          description: "The body of the email. [See the docs here](https://www.braze.com/docs/api/objects_filters/messaging/email_object/).",
          optional: true,
        },
      }),
      ...this.addProps(this.showWebhookProps, {
        webhookUrl: {
          type: "string",
          label: "Webhook URL",
          description: "The URL of the webhook. [See the docs here](https://www.braze.com/docs/api/objects_filters/messaging/webhook_object/).",
          optional: true,
        },
        webhookBody: {
          type: "string",
          label: "Webhook Body",
          description: "The body of the webhook. If you want to include a JSON object, make sure to escape quotes and backslashes. [See the docs here](https://www.braze.com/docs/api/objects_filters/messaging/webhook_object/).",
          optional: true,
        },
      }),
      ...this.addProps(this.showContentCardProps, {
        contentCardTitle: {
          type: "string",
          label: "Content Card Title",
          description: "The title of the content card. [See the docs here](https://www.braze.com/docs/api/objects_filters/messaging/content_cards_object/).",
          optional: true,
        },
        contentCardDescription: {
          type: "string",
          label: "Content Card Description",
          description: "The description of the content card. [See the docs here](https://www.braze.com/docs/api/objects_filters/messaging/content_cards_object/).",
          optional: true,
        },
      }),
      ...this.addProps(this.showSmsProps, {
        smsSubscriptionGroupId: {
          type: "string",
          label: "SMS Subscription Group ID",
          description: "The ID of the SMS subscription group. [See the docs here](https://www.braze.com/docs/api/objects_filters/messaging/sms_object/).",
          optional: true,
        },
        smsBody: {
          type: "string",
          label: "SMS Body",
          description: "The body of the SMS. [See the docs here](https://www.braze.com/docs/api/objects_filters/messaging/sms_object/).",
          optional: true,
        },
        smsAppId: {
          type: "string",
          label: "SMS App ID",
          description: "The ID of the SMS app. [See the docs here](https://www.braze.com/docs/api/objects_filters/messaging/sms_object/) and [here](https://www.braze.com/docs/api/identifier_types/).",
          optional: true,
        },
      }),
    };
  },
  methods: {
    addProps(predicate, props) {
      return predicate && props || {};
    },
    sendMessage(args = {}) {
      return this.app.create({
        path: "/messages/send",
        ...args,
      });
    },
  },
  async run({ $: step }) {
    const {
      userAliasName,
      userAliasLabel,
      applePushAlert,
      androidPushTitle,
      androidPushAlert,
      kindlePushTitle,
      kindlePushAlert,
      webPushTitle,
      webPushAlert,
      emailAppId,
      emailFrom,
      emailBody,
      webhookUrl,
      webhookBody,
      contentCardTitle,
      contentCardDescription,
      smsSubscriptionGroupId,
      smsBody,
      smsAppId,
    } = this;

    const messages = utils.reduceProperties({
      additionalProps: {
        apple_push: [
          {
            alert: applePushAlert,
          },
          applePushAlert,
        ],
        android_push: [
          {
            title: androidPushTitle,
            alert: androidPushAlert,
          },
          androidPushTitle && androidPushAlert,
        ],
        kindle_push: [
          {
            alert: kindlePushAlert,
            title: kindlePushTitle,
          },
          kindlePushTitle && kindlePushAlert,
        ],
        web_push: [
          {
            alert: webPushAlert,
            title: webPushTitle,
          },
          webPushTitle && webPushAlert,
        ],
        email: [
          {
            app_id: emailAppId,
            from: emailFrom,
            body: emailBody,
          },
          emailAppId && emailFrom && emailBody,
        ],
        webhook: [
          {
            url: webhookUrl,
            body: webhookBody,
            request_method: "POST",
          },
          webhookUrl && webhookBody,
        ],
        content_card: [
          {
            type: "CLASSIC",
            title: contentCardTitle,
            description: contentCardDescription,
          },
          contentCardTitle && contentCardDescription,
        ],
        sms: [
          {
            app_id: smsAppId,
            subscription_group_id: smsSubscriptionGroupId,
            body: smsBody,
          },
          smsSubscriptionGroupId && smsBody && smsAppId,
        ],
      },
    });

    if (!Object.keys(messages).length) {
      throw new ConfigurationError("You must set at least one message type.");
    }

    const response = await this.sendMessage({
      data: {
        user_aliases: [
          {
            user_alias: {
              alias_name: userAliasName,
              alias_label: userAliasLabel,
            },
          },
        ],
        messages,
      },
    });

    step.export("$summary", `Successfully sent message with ID ${response.id}`);

    return response;
  },
};
