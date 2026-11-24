import firsttouch from "../../firsttouch.app.mjs";

export default {
  key: "firsttouch-send-connection-request",
  name: "Send Connection Request",
  description: "Send a LinkedIn connection request from a teammate, with an optional note. By default the step waits for approval in FirstTouch Tasks. [See the documentation](https://docs.firsttouch.com)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
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
    note: {
      type: "string",
      label: "Note",
      description: "Optional connection note, up to about 300 characters",
      optional: true,
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
    try {
      const response = await this.firsttouch.startLinkedinStep({
        $,
        actionType: "linkedin_connect",
        label: "Send Connection Request",
        linkedinUrl: this.linkedinUrl,
        firstName: this.firstName,
        lastName: this.lastName,
        senderId: this.senderId,
        email: this.email,
        companyDomain: this.companyDomain,
        reason: this.reason,
        requireApproval: this.requireApproval,
        extra: {
          message: this.note || "",
        },
      });
      $.export("$summary", response.summary || "Connection request created");
      return response;
    } catch (error) {
      const detail = error?.response?.data?.message || error?.message || "";
      if (/already connected/i.test(detail)) {
        const who = (detail.match(/sender '([^']+)'/) || [])[1] || "The sender";
        throw new Error(`${who} is already connected to this contact on LinkedIn, so no request was sent. Use Check Connection Status first and Send Message for existing connections.`);
      }
      throw error;
    }
  },
};
