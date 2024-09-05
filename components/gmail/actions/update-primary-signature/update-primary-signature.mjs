import common from "../../common/verify-client-id.mjs";

export default {
  ...common,
  key: "gmail-update-primary-signature",
  name: "Update Signature for Primary Email Address",
  description: "Update the signature for the primary email address. [See the documentation](https://developers.google.com/gmail/api/reference/rest/v1/users.settings.sendAs/update)",
  version: "0.0.1",
  type: "action",
  props: {
    ...common.props,
    signature: {
      type: "string",
      label: "Signature",
      description: "The new signature.",
    },
  },
  methods: {
    ...common.methods,
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
