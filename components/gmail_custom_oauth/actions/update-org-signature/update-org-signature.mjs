import googleCloud from "../../../google_cloud/google_cloud.app.mjs";
import base from "../update-primary-signature/update-primary-signature.mjs";

export default {
  ...base,
  key: "gmail_custom_oauth-update-org-signature",
  name: "Update Signature for Email in Organization",
  description: `Update the signature for a specific email address in an organization.
    A Google Cloud service account with delegated domain-wide authority is required for this action. [See docs here](https://developers.google.com/gmail/api/reference/rest/v1/users.settings.sendAs/update)`,
  version: "0.0.1",
  type: "action",
  props: {
    gmail: base.props.gmail,
    googleCloud,
    signature: base.props.signature,
    email: {
      type: "string",
      label: "Email",
      description: `The email address that will have the signature updated. If updating the primary address, please use **${base.name}** action.`,
    },
  },
  methods: {
    async createOpts() {
      /**
        * Get Service Account credentials from connected Google Cloud account
        * Service Account needs to have domain-wide delegation enabled
      */
      const credentials = this.googleCloud.authKeyJson();
      return {
        signature: this.signature,
        email: this.email,
        credentials,
      };
    },
  },
};
