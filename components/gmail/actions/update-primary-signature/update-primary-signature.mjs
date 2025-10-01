import gmail from "../../gmail.app.mjs";

export default {
  key: "gmail-update-primary-signature",
  name: "Update Signature for Primary Email Address",
  description: "Update the signature for the primary email address. [See the documentation](https://developers.google.com/gmail/api/reference/rest/v1/users.settings.sendAs/update)",
  version: "0.0.12",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
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
