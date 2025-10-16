import app from "../../contactout.app.mjs";

export default {
  key: "contactout-get-contact-info",
  name: "Get Contact Info from LinkedIn Profile",
  description: "Get contact information (email and phone) for a LinkedIn profile using a LinkedIn URL. [See the documentation](https://api.contactout.com/#from-linkedin-profile).",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    profile: {
      propDefinition: [
        app,
        "profile",
      ],
      description: "The LinkedIn profile URL to get contact information for. URL must begin with http and must contain linkedin.com/in/ or linkedin.com/pub/",
    },
    includePhone: {
      propDefinition: [
        app,
        "includePhone",
      ],
    },
    emailType: {
      propDefinition: [
        app,
        "emailType",
      ],
    },
  },
  async run({ $ }) {
    const params = {
      profile: this.profile,
    };

    if (this.includePhone) {
      params.include_phone = this.includePhone;
    }

    if (this.emailType) {
      params.email_type = this.emailType;
    }

    const response = await this.app.getContactInfo({
      $,
      params,
    });

    $.export("$summary", `Successfully retrieved contact info for LinkedIn profile: ${this.profile}`);
    return response;
  },
};
