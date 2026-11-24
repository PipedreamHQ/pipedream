import firsttouch from "../../firsttouch.app.mjs";

export default {
  key: "firsttouch-view-profile",
  name: "View Profile",
  description: "Visit a contact's LinkedIn profile from a teammate's account. By default the step waits for approval in FirstTouch Tasks. [See the documentation](https://docs.firsttouch.com)",
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
      description: "The teammate whose LinkedIn account visits. Leave empty for the owner of the API key.",
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
      actionType: "linkedin_profile_view",
      label: "View Profile",
      linkedinUrl: this.linkedinUrl,
      firstName: this.firstName,
      lastName: this.lastName,
      senderId: this.senderId,
      email: this.email,
      companyDomain: this.companyDomain,
      reason: this.reason,
      requireApproval: this.requireApproval,
    });
    $.export("$summary", response.summary || "Profile view created");
    return response;
  },
};
