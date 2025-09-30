import zonkaFeedback from "../../zonka_feedback.app.mjs";

export default {
  key: "zonka_feedback-send-sms-survey",
  name: "Send SMS Survey",
  description: "Send a survey by SMS. Please ensure you have enough SMS credits. [See docs](https://apidocs.zonkafeedback.com/?version=latest#9b6a1283-fb22-457e-8031-cf18d51d26f7)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    zonkaFeedback,
    surveyId: {
      propDefinition: [
        zonkaFeedback,
        "surveyId",
      ],
    },
    mobile: {
      type: "string",
      label: "Mobile Number",
      description: "Mobile number of the recipient to which the survey is to be sent. Please include the country code, e.g., +9198XXXXXXXX.",
    },
    name: {
      type: "string",
      label: "Name",
      description: "Name of the recipient",
      optional: true,
    },
    attributes: {
      propDefinition: [
        zonkaFeedback,
        "attributes",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.zonkaFeedback.sendSmsSurvey({
      $,
      data: {
        surveyId: this.surveyId,
        mobile: this.mobile,
        name: this.name,
        attributes: this.attributes,
      },
    });
    $.export("$summary", `Survey sent to ${this.mobile}. If you do not have enough SMS credits, then the message won't be sent.`);
    return response;
  },
};
