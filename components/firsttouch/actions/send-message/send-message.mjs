import firsttouch from "../../firsttouch.app.mjs";

export default {
  key: "firsttouch-send-message",
  name: "Send Message",
  description: "Send a LinkedIn message to someone a teammate is already connected to. By default the step waits for approval in FirstTouch Tasks. [See the documentation](https://docs.firsttouch.com)",
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
    message: {
      type: "string",
      label: "Message",
      description: "The exact LinkedIn message to send, e.g. `Hi Jane, thanks for connecting. Are you the right person to talk to about LinkedIn outreach at Acme?`",
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
      actionType: "linkedin_message",
      label: "Send Message",
      linkedinUrl: this.linkedinUrl,
      firstName: this.firstName,
      lastName: this.lastName,
      senderId: this.senderId,
      email: this.email,
      companyDomain: this.companyDomain,
      reason: this.reason,
      requireApproval: this.requireApproval,
      extra: {
        message: this.message,
      },
    });
    $.export("$summary", response.summary || "LinkedIn message created");
    return response;
  },
};
