import {
  LANGUAGE_OPTIONS, OBJECT_TYPE,
} from "../../common/constants.mjs";
import { parseObject } from "../../common/utils.mjs";
import hubspot from "../../hubspot.app.mjs";
import common from "../common/common-get-object.mjs";

export default {
  key: "hubspot-create-email",
  name: "Create Marketing Email",
  description:
    "Create a marketing email in Hubspot. [See the documentation](https://developers.hubspot.com/docs/reference/api/marketing/emails/marketing-emails#post-%2Fmarketing%2Fv3%2Femails%2F)",
  version: "0.0.9",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    hubspot,
    name: {
      type: "string",
      label: "Name",
      description: "The name of the email",
    },
    campaign: {
      propDefinition: [
        hubspot,
        "campaignId",
      ],
      optional: true,
    },
    customReplyTo: {
      type: "string",
      label: "Custom Reply To",
      description: "The custom reply to address for the email",
      optional: true,
    },
    fromName: {
      type: "string",
      label: "From Name",
      description: "The name of the sender",
      optional: true,
    },
    replyTo: {
      type: "string",
      label: "Reply To",
      description: "The reply to address for the email",
      optional: true,
    },
    limitSendFrequency: {
      type: "boolean",
      label: "Limit Send Frequency",
      description: "Whether to limit the send frequency for the email",
      optional: true,
    },
    suppressGraymail: {
      type: "boolean",
      label: "Suppress Graymail",
      description: "Whether to suppress graymail for the email",
      optional: true,
    },
    includeContactLists: {
      propDefinition: [
        hubspot,
        "lists",
      ],
      optional: true,
    },
    excludeContactLists: {
      propDefinition: [
        hubspot,
        "lists",
      ],
      optional: true,
    },
    feedbackSurveyId: {
      ...common.props.objectId,
      label: "Feedback Survey ID",
      description: "Hubspot's internal ID for the feedback survey",
      optional: true,
    },
    rssData: {
      type: "object",
      label: "RSS Data",
      description:
        "An object with the RSS data for the email. [See the documentation](https://developers.hubspot.com/docs/reference/api/marketing/emails/marketing-emails#post-%2Fmarketing%2Fv3%2Femails%2F) for more information.",
      optional: true,
    },
    subject: {
      type: "string",
      label: "Subject",
      description: "The subject of the email",
      optional: true,
    },
    testing: {
      type: "object",
      label: "Testing",
      description:
        "An object with the testing data for the email. [See the documentation](https://developers.hubspot.com/docs/reference/api/marketing/emails/marketing-emails#post-%2Fmarketing%2Fv3%2Femails%2F) for more information.",
      optional: true,
    },
    language: {
      type: "string",
      label: "Language",
      description: "The language of the email",
      options: LANGUAGE_OPTIONS,
      optional: true,
    },
    content: {
      type: "object",
      label: "Content",
      description:
        "An object with the content data for the email. [See the documentation](https://developers.hubspot.com/docs/reference/api/marketing/emails/marketing-emails#post-%2Fmarketing%2Fv3%2Femails%2F) for more information.",
      optional: true,
    },
    webversion: {
      type: "object",
      label: "Webversion",
      description:
        "An object with the webversion data for the email. [See the documentation](https://developers.hubspot.com/docs/reference/api/marketing/emails/marketing-emails#post-%2Fmarketing%2Fv3%2Femails%2F) for more information.",
      optional: true,
    },
    subscriptionDetails: {
      type: "object",
      label: "Subscription Details",
      description:
        "An object with the subscription details for the email. [See the documentation](https://developers.hubspot.com/docs/reference/api/marketing/emails/marketing-emails#post-%2Fmarketing%2Fv3%2Femails%2F) for more information.",
      optional: true,
    },
    sendOnPublish: {
      type: "boolean",
      label: "Send On Publish",
      description: "Whether to send the email on publish",
      optional: true,
    },
  },
  methods: {
    ...common.methods,
    getObjectType() {
      return OBJECT_TYPE.FEEDBACK_SUBMISSION;
    },
  },
  async run({ $ }) {
    const response = await this.hubspot.createEmail({
      $,
      data: {
        name: this.name,
        campaign: this.campaign,
        from: {
          customReplyTo: this.customReplyTo,
          fromName: this.fromName,
          replyTo: this.replyTo,
        },
        to: {
          limitSendFrequency: this.limitSendFrequency,
          suppressGraymail: this.suppressGraymail,
          contactLists: {
            include: parseObject(this.includeContactLists),
            exclude: parseObject(this.excludeContactLists),
          },
        },
        feedbackSurveyId: this.feedbackSurveyId,
        rssData: parseObject(this.rssData),
        subject: this.subject,
        testing: parseObject(this.testing),
        language: this.language,
        content: parseObject(this.content),
        webversion: parseObject(this.webversion),
        subscriptionDetails: parseObject(this.subscriptionDetails),
        sendOnPublish: this.sendOnPublish,
      },
    });

    $.export("$summary", `Successfully created email with ID: ${response.id}`);

    return response;
  },
};
