import { throwError } from "../../common/utils.mjs";
import jigsawstack from "../../jigsawstack.app.mjs";

export default {
  key: "jigsawstack-verify-email",
  name: "Verify Email",
  description: "Validate any email address and determine deliverability as well as disposable status. [See the documentation](https://docs.jigsawstack.com/api-reference/validate/email)",
  version: "0.0.1",
  type: "action",
  props: {
    jigsawstack,
    email: {
      type: "string",
      label: "Email Address",
      description: "The email address to validate.",
    },
  },
  async run({ $ }) {
    try {
      const response = await this.jigsawstack.validateEmail({
        $,
        params: {
          email: this.email,
        },
      });

      $.export("$summary", `Successfully validated email: ${this.email}`);
      return response;
    } catch (e) {
      return throwError(e);
    }
  },
};
