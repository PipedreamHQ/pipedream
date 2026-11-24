import firsttouch from "../../firsttouch.app.mjs";

export default {
  key: "firsttouch-send-inmail",
  name: "Send InMail",
  description: "Send a LinkedIn InMail from a teammate with LinkedIn Premium or Sales Navigator. By default the step waits for approval in FirstTouch Tasks. [See the documentation](https://docs.firsttouch.com)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  ai: "optimized",
  props: {
    firsttouch,
    linkedinUrl: {
      propDefinition: [
        firsttouch,
        "linkedinUrl",
      ],
    },
    firstName: {
      propDefinition: [
        firsttouch,
        "firstName",
      ],
    },
    lastName: {
      propDefinition: [
        firsttouch,
        "lastName",
      ],
    },
    senderId: {
      propDefinition: [
        firsttouch,
        "senderId",
      ],
    },
    subject: {
      type: "string",
      label: "Subject",
      description: "The InMail subject, up to 200 characters, e.g. `Quick question about outbound at Acme`",
    },
    body: {
      type: "string",
      label: "InMail Body",
      description: "The exact InMail text, up to 1,900 characters, e.g. `Hi Jane, I saw Acme is hiring two SDRs. We help HubSpot teams run LinkedIn outreach with an approval step. Open to a 15-minute call next week?`",
    },
    email: {
      propDefinition: [
        firsttouch,
        "email",
      ],
    },
    companyDomain: {
      propDefinition: [
        firsttouch,
        "companyDomain",
      ],
    },
    reason: {
      propDefinition: [
        firsttouch,
        "reason",
      ],
    },
    requireApproval: {
      propDefinition: [
        firsttouch,
        "requireApproval",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.firsttouch.startLinkedinStep({
      $,
      actionType: "linkedin_inmail",
      label: "Send InMail",
      linkedinUrl: this.linkedinUrl,
      firstName: this.firstName,
      lastName: this.lastName,
      senderId: this.senderId,
      email: this.email,
      companyDomain: this.companyDomain,
      reason: this.reason,
      requireApproval: this.requireApproval,
      extra: {
        subject: this.subject,
        prompt: this.body,
      },
    });
    $.export("$summary", response.summary || "LinkedIn InMail created");
    return response;
  },
};
