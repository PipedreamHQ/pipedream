import gmail from "../../gmail_custom_oauth.app.mjs";
import base from "../update-org-signature/update-org-signature.mjs";

const docLink = "https://developers.google.com/gmail/api/reference/rest/v1/users.settings.sendAs/update";

export default {
  key: "gmail_custom_oauth-update-primary-signature",
  name: "Update Signature for Primary Email Address",
  description: `Update the signature for the primary email address. [See the docs.](${docLink})`,
  version: "0.0.1",
  type: "action",
  props: {
    gmail,
    signature: base.props.signature,
  },
  async run({ $ }) {
    const email = (await this.gmail.userInfo()).email;
    const response = await this.gmail.updateSignature({
      signature: this.signature,
      email,
    });
    $.export("$summary", `Successfully updated signature for ${email}`);
    return response;
  },
};
