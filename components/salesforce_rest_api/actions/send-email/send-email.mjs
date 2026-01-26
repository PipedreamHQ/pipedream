import salesforce from "../../salesforce_rest_api.app.mjs";

export default {
  key: "salesforce_rest_api-send-email",
  name: "Send Email",
  description: "Sends an email. [See the documentation](https://developer.salesforce.com/docs/atlas.en-us.api_action.meta/api_action/actions_obj_email_simple.htm)",
  version: "0.1.0",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    salesforce,
    emailAddress: {
      type: "string",
      label: "Email Address",
      description: "The email address to send the email to",
    },
    emailSubject: {
      type: "string",
      label: "Subject",
      description: "The subject of the email",
    },
    emailBody: {
      type: "string",
      label: "Body",
      description: "The body of the email",
    },
    logEmailOnSend: {
      type: "boolean",
      label: "Log Email on Send",
      description: "Indicates whether to log the email on the specified records’ activity time lines",
      optional: true,
    },
  },
  methods: {
    sendEmail(opts = {}) {
      return this.salesforce._makeRequest({
        url: `${this.salesforce._baseApiVersionUrl()}/actions/standard/emailSimple`,
        method: "POST",
        ...opts,
      });
    },
  },
  async run({ $ }) {
    const response = await this.sendEmail({
      $,
      data: {
        inputs: [
          {
            emailAddresses: this.emailAddress,
            emailSubject: this.emailSubject,
            emailBody: this.emailBody,
            senderType: "CurrentUser",
            logEmailOnSend: this.logEmailOnSend,
          },
        ],
      },
    });
    $.export("$summary", `Email sent to ${this.emailAddress}`);
    return response;
  },
};
