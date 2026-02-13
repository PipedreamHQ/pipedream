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
      description: "Indicates whether to log the email on the specified records' activity time lines",
      optional: true,
    },
    relatedRecordId: {
      type: "string",
      label: "Related Record ID",
      description: "The ID of a record that is not a person (for example, a case record). If `logEmailOnSend` is included, this is the ID of a secondary record (except a lead) to log the email to.",
      optional: true,
    },
    addThreadingTokenToBody: {
      type: "boolean",
      label: "Add Threading Token to Body",
      description: "Whether to create a unique token for the related record and add it to the email body. When the related record is a case record, Email-to-Case uses the token to link future email responses to that case.",
      optional: true,
    },
    addThreadingTokenToSubject: {
      type: "boolean",
      label: "Add Threading Token to Subject",
      description: "The same as `Add Threading Token to Body`, but for the email subject.",
      optional: true,
    },
    senderType: {
      type: "string",
      label: "Sender Type",
      description: "Email address used as the email's **From** and **Reply-To** addresses. In scheduled flows, the only valid value is `OrgWideEmailAddress`.",
      options: [
        {
          label: "CurrentUser - Email address of the user running the flow (default)",
          value: "CurrentUser",
        },
        {
          label: "DefaultWorkflowUser - Email address of the default workflow user",
          value: "DefaultWorkflowUser",
        },
        {
          label: "OrgWideEmailAddress - The organization-wide email address, specified in senderAddress",
          value: "OrgWideEmailAddress",
        },
      ],
      default: "CurrentUser",
    },
    senderAddress: {
      type: "string",
      label: "Sender Address",
      description: "If `Sender Type` is `OrgWideEmailAddress`, this is the organization-wide email address to be used as the sender.",
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
            senderType: this.senderType,
            logEmailOnSend: this.logEmailOnSend,
            relatedRecordId: this.relatedRecordId,
            addThreadingTokenToBody: this.addThreadingTokenToBody,
            addThreadingTokenToSubject: this.addThreadingTokenToSubject,
            senderAddress: this.senderAddress,
          },
        ],
      },
    });
    $.export("$summary", `Email sent to ${this.emailAddress}`);
    return response;
  },
};
