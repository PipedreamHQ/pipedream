import app from "../../heyy.app.mjs";
import constants from "../../common/constants.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "heyy-send-whatsapp-message",
  name: "Send WhatsApp Message",
  description: "Sends a WhatsApp message to a contact. [See the documentation](https://documenter.getpostman.com/view/27408936/2sa2r3a6dw)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    channelId: {
      propDefinition: [
        app,
        "channelId",
      ],
    },
    phoneNumber: {
      label: "Phone Number",
      description: "The phone number of the contact.",
      propDefinition: [
        app,
        "contactId",
        () => ({
          mapper: ({
            firstName, phoneNumber: value,
          }) => ({
            label: firstName || value,
            value,
          }),
        }),
      ],
    },
    msgType: {
      type: "string",
      label: "Message Type",
      description: "The type of message to send.",
      options: Object.values(constants.MSG_TYPE),
      reloadProps: true,
    },
  },
  additionalProps() {
    const { msgType } = this;

    const bodyText = {
      type: "string",
      label: "Body Text",
      description: "The text of the message to send.",
    };

    if (msgType === constants.MSG_TYPE.TEXT) {
      return {
        bodyText,
      };
    }

    if (msgType === constants.MSG_TYPE.IMAGE) {
      return {
        bodyText,
        fileId: {
          type: "string",
          label: "File ID",
          description: "The ID of the file to attach to the message.",
        },
      };
    }

    if (msgType === constants.MSG_TYPE.TEMPLATE) {
      return {
        messageTemplateId: {
          type: "string",
          label: "Message Template ID",
          description: "The ID of the message template to use.",
          optional: true,
          options: async ({ page }) => {
            const { data: { messageTemplates } } = await this.app.getMessageTemplates({
              params: {
                page,
                sortBy: "updatedAt",
                order: "DESC",
              },
            });
            return messageTemplates.map(({
              id: value, name: label,
            }) => ({
              label,
              value,
            }));
          },
        },
      };
    }

    if (msgType === constants.MSG_TYPE.INTERACTIVE) {
      return {
        bodyText,
        buttons: {
          type: "string[]",
          label: "Buttons",
          description: "The buttons to include in the message. Each row should have a JSON formated string. Eg. `{ \"id\": \"STRING\", \"title\": \"STRING\" }`.",
        },
        headerText: {
          type: "string",
          label: "Header Text",
          description: "The header text of the message to send.",
          optional: true,
        },
        footerText: {
          type: "string",
          label: "Footer Text",
          description: "The footer text of the message to send.",
          optional: true,
        },
      };
    }

    return {};
  },
  methods: {
    sendWhatsappMessage({
      channelId, ...args
    } = {}) {
      return this.app.post({
        path: `/${channelId}/whatsapp_messages/send`,
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      sendWhatsappMessage,
      channelId,
      phoneNumber,
      msgType,
      bodyText,
      fileId,
      messageTemplateId,
      headerText,
      footerText,
      buttons,
    } = this;

    const response = await sendWhatsappMessage({
      $,
      channelId,
      data: {
        phoneNumber,
        type: msgType,
        bodyText,
        fileId,
        messageTemplateId,
        headerText,
        footerText,
        buttons: utils.parseArray(buttons),
      },
    });
    $.export("$summary", "Succesfully sent WhatsApp message.");
    return response;
  },
};
