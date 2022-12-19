import gmail from "../../gmail_custom_oauth.app.mjs";
import googleCloud from "../../../google_cloud/google_cloud.app.mjs";

const docLink = "https://developers.google.com/gmail/api/reference/rest/v1/users.settings.sendAs/update";

export default {
  key: "gmail_custom_oauth-update-org-signature",
  name: "Update Signature for Email in Organization",
  description: `Update the signature for a specific email address in an organization. A Google Cloud service account with delegated domain-wide authority is required for this action. [See the docs.](${docLink})`,
  version: "0.0.1",
  type: "action",
  props: {
    gmail,
    googleCloud,
    signature: {
      type: "string",
      label: "Signature",
      description: "The new signature.",
    },
    email: {
      type: "string",
      label: "Email",
      description: "The email address that will have the signature updated. If updating the primary address, please use **Update Signature for Primary Email Address** action.",
    },
  },
  async run({ $ }) {
    /**
     * Get Service Account credentials from connected Google Cloud account
     * Service Account needs to have domain-wide delegation enabled
    */
    const credentials = this.googleCloud.authKeyJson();
    const response = await this.gmail.updateSignature({
      signature: this.signature,
      email: this.email,
      credentials,
    });
    $.export("$summary", `Successfully updated signature for ${this.email}`);
    return response;
  },
};
