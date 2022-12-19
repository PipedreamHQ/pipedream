import gmail from "../../gmail_custom_oauth.app.mjs";

const docLink = "https://developers.google.com/gmail/api/reference/rest/v1/users.settings.sendAs/update";

export default {
  key: "gmail_custom_oauth-update-primary-signature",
  name: "Update Signature for Primary Email Address",
  description: `Update the signature for the primary email address. [See the docs.](${docLink})`,
  version: "0.0.1",
  type: "action",
  props: {
    gmail,
    signature: {
      type: "string",
      label: "Signature",
      description: "The new signature.",
    },
  },
  methods: {
    async createOpts() {
      const { email } = await this.gmail.userInfo();
      return {
        signature: this.signature,
        email,
      };
    },
  },
  async run({ $ }) {
    const opts = await this.createOpts();
    const response = await this.gmail.updateSignature(opts);
    $.export("$summary", `Successfully updated signature for ${opts.email}`);
    return response;
  },
};
