import app from "../../contactout.app.mjs";

export default {
  key: "contactout-get-contact-info-by-member-id",
  name: "Get Contact Info by LinkedIn Member ID",
  description: "Get contact information (email and phone) for a LinkedIn profile using a LinkedIn Member ID. [See the documentation](https://api.contactout.com/#from-linkedin-memberid).",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    memberId: {
      propDefinition: [
        app,
        "memberId",
      ],
      description: "LinkedIn Member ID is a unique identifier assigned to each member on the LinkedIn platform",
    },
    includePhone: {
      propDefinition: [
        app,
        "includePhone",
      ],
    },
  },
  async run({ $ }) {
    const params = {
      member_id: this.memberId,
    };

    if (this.includePhone) {
      params.include_phone = this.includePhone;
    }

    const response = await this.app.getContactInfoByMemberId({
      $,
      params,
    });

    $.export("$summary", `Successfully retrieved contact info for LinkedIn Member ID: ${this.memberId}`);
    return response;
  },
};
