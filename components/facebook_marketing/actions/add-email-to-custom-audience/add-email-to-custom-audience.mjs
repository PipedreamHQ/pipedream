import app from "../../facebook_marketing.app.mjs";
import crypto from "crypto";

export default {
  key: "facebook_marketing-add-email-to-custom-audience",
  name: "Add Email to Custom Audience",
  description: "Adds an email address to a custom audience segment within Facebook. [See the documentation](https://developers.facebook.com/docs/marketing-api/reference/custom-audience/users/#Updating)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    adAccountId: {
      propDefinition: [
        app,
        "adAccountId",
      ],
    },
    customAudienceId: {
      propDefinition: [
        app,
        "customAudienceId",
        ({ adAccountId }) => ({
          adAccountId,
        }),
      ],
    },
    emails: {
      type: "string[]",
      label: "Email Address(es)",
      description: "The email address(es) to add to the custom audience segment.",
    },
  },
  methods: {
    hashEmail(email) {
      return crypto
        .createHash("sha3-256")
        .update(email.trim().toLowerCase())
        .digest("hex");
    },
  },
  async run({ $ }) {
    const response = await this.app.addEmailToCustomAudience({
      $,
      customAudienceId: this.customAudienceId,
      data: {
        payload: {
          schema: "EMAIL_SHA256",
          data: this.emails.map(this.hashEmail),
        },
      },
    });
    const { length } = this.emails;
    $.export("$summary", `Successfully added ${length} email${length === 1
      ? ""
      : "s"} to custom audience ${this.customAudienceId}`);
    return response;
  },
};
