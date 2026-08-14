import base from "../common/base-survey.mjs";
import constants from "../../common/constants.mjs";

export default {
  ...base,
  key: "survey_monkey-create-collector",
  name: "Create Collector",
  description: "Create a collector for a survey. A collector is the channel responses come in through — an SMS or email invitation, a web link, or a popup. [See the docs here](https://api.surveymonkey.com/v3/docs?javascript#api-endpoints-post-surveys-survey_id-collectors)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    ...base.props,
    type: {
      type: "string",
      label: "Type",
      description: "The kind of collector to create. Every type except **Web link** requires a paid SurveyMonkey plan.",
      options: constants.COLLECTOR_TYPES,
    },
    name: {
      type: "string",
      label: "Name",
      description: "A nickname for the collector.",
    },
    senderEmail: {
      type: "string",
      label: "Sender Email",
      description: "Sender email for email collectors. The address must be verified in your SurveyMonkey account before invitations will send.",
      optional: true,
    },
    thankYouMessage: {
      type: "string",
      label: "Thank You Message",
      description: "Message shown on the thank you page once a respondent completes the survey. SurveyMonkey treats this as the older form of `thank_you_page` and recommends that object instead — pass it through **Additional Options** to use it.",
      optional: true,
    },
    closedPageMessage: {
      type: "string",
      label: "Closed Page Message",
      description: "Message shown once the survey is closed.",
      optional: true,
    },
    redirectUrl: {
      type: "string",
      label: "Redirect URL",
      description: "Redirect respondents to this URL on survey completion.",
      optional: true,
    },
    closeDate: {
      type: "string",
      label: "Close Date",
      description: "When the collector should close, e.g. `2026-12-03T10:15:30+00:00`.",
      optional: true,
    },
    responseLimit: {
      type: "integer",
      label: "Response Limit",
      description: "Close the collector after this many responses.",
      optional: true,
    },
    anonymousType: {
      type: "string",
      label: "Anonymous Type",
      description: "Turns off IP tracking. For email collectors it also removes the respondent's email address and name from the response.",
      options: constants.ANONYMOUS_TYPES,
      optional: true,
    },
    editResponseType: {
      type: "string",
      label: "Edit Response Type",
      description: "When respondents can edit their response.",
      options: constants.EDIT_RESPONSE_TYPES,
      optional: true,
    },
    isBrandingEnabled: {
      type: "boolean",
      label: "Is Branding Enabled",
      description: "Whether the popup has SurveyMonkey branding. Only applies to popup collectors.",
      optional: true,
    },
    additionalOptions: {
      type: "object",
      label: "Additional Options",
      description: "Any other collector option to send in the request body, e.g. `{\"thank_you_page\": {\"is_enabled\": true, \"message\": \"Thanks!\"}}` or the popup-only `width`/`height`/`sample_rate` settings. See the documentation for the full list. Note that values typed directly into this field arrive as strings, so pass booleans and numbers from a previous step or an expression when the API expects those types.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.surveyMonkey.createCollector({
      $,
      surveyId: this.survey,
      data: {
        type: this.type,
        name: this.name,
        sender_email: this.senderEmail,
        thank_you_message: this.thankYouMessage,
        closed_page_message: this.closedPageMessage,
        redirect_url: this.redirectUrl,
        close_date: this.closeDate,
        response_limit: this.responseLimit,
        anonymous_type: this.anonymousType,
        edit_response_type: this.editResponseType,
        is_branding_enabled: this.isBrandingEnabled,
        ...this.additionalOptions,
      },
    });

    $.export("$summary", `Successfully created ${this.type} collector "${this.name}"`);
    return response;
  },
};
