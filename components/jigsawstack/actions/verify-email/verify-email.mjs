import jigsawstack from "../../jigsawstack.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "jigsawstack-verify-email",
  name: "Verify Email",
  description: "Validate any email address and determine deliverability as well as disposable status. [See the documentation](https://docs.jigsawstack.com/api-reference/validate/email)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    jigsawstack,
    email: {
      propDefinition: [
        jigsawstack,
        "email",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.jigsawstack.validateEmail({
      email: this.email,
    });

    $.export("$summary", `Successfully validated email: ${this.email}`);
    return response;
  },
};
