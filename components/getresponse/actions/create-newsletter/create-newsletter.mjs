import app from "../../getresponse.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "getresponse-create-newsletter",
  name: "Create Newsletter",
  description: "Creates a new newsletter and puts it in a queue to send. [See the docs here](https://apireference.getresponse.com/?_ga=2.47520738.499257728.1666974700-2116668472.1666974700&amp;_gl=1*1f3h009*_ga*MjExNjY2ODQ3Mi4xNjY2OTc0NzAw*_ga_EQ6LD9QEJB*MTY2Njk3NzM0Ny4yLjEuMTY2Njk3ODQ3OS4zNi4wLjA.#operation/createNewsletter)",
  type: "action",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    name: {
      type: "string",
      label: "Name",
      description: "The newsletter name",
      optional: true,
    },
    type: {
      type: "string",
      label: "Type",
      description: "The newsletter type",
      optional: true,
      options: [
        "broadcast",
        "draft",
      ],
    },
    campaignId: {
      propDefinition: [
        app,
        "campaignId",
      ],
    },
    subject: {
      type: "string",
      label: "Subject",
      description: "The newsletter name",
    },
    fromFieldId: {
      propDefinition: [
        app,
        "fromFieldId",
      ],
    },
    selectedCampaigns: {
      type: "string[]",
      label: "Selected Campaigns",
      description: "Specify which campaigns you will want the message be deliver to.",
      propDefinition: [
        app,
        "campaignId",
      ],
    },
    selectedContacts: {
      type: "string[]",
      label: "Selected Contacts",
      description: "Specify which contacts you will want the message be deliver to.",
      propDefinition: [
        app,
        "contactId",
      ],
      optional: true,
    },
    selectedSegments: {
      type: "string[]",
      label: "Selected Segments",
      description: "Specify which segments you will want the message be deliver to.",
      propDefinition: [
        app,
        "searchContactId",
      ],
      optional: true,
    },
    contentType: {
      type: "string",
      label: "Content Type",
      description: "Flag to show either **Text Content** or **HTML Content** property",
      options: constants.CONTENT_TYPE_OPTIONS,
      default: "plain",
      reloadProps: true,
    },
  },
  async additionalProps() {
    if (this.contentType === constants.CONTENT_TYPE_OPTIONS[1]) {
      return {
        html: {
          type: "string",
          label: "HTML Content",
          description: "The message content in HTML",
        },
      };
    }

    return {
      plain: {
        type: "string",
        label: "Text Content",
        description: "The plain text equivalent of the message content",
      },
    };
  },
  async run({ $: step }) {
    const {
      campaignId,
      subject,
      fromFieldId,
      selectedCampaigns,
      selectedContacts,
      selectedSegments,
      name,
      type,
    } = this;

    const contentType =
      constants.CONTENT_TYPE_OPTIONS.includes(this.contentType)
      && this.contentType
      || constants.CONTENT_TYPE_OPTIONS[0];

    const content = this[contentType];

    const response = await this.app.createNewsletter({
      step,
      data: {
        name,
        type,
        subject,
        campaign: {
          campaignId,
        },
        content: {
          [contentType]: content,
        },
        fromField: {
          fromFieldId,
        },
        sendSettings: {
          selectedCampaigns,
          selectedSegments,
          selectedContacts,
        },
      },
    });

    step.export("$summary", "The newsletter has been put in a queue to send.");

    return response;
  },
};
