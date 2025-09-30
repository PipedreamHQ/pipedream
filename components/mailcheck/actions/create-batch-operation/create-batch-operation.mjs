import { parseObject } from "../../common/utils.mjs";
import mailcheck from "../../mailcheck.app.mjs";

export default {
  key: "mailcheck-create-batch-operation",
  name: "Create Batch Operation",
  description: "Create a batch check operation. [See the documentation](https://app.mailcheck.co/docs?from=docs#post-/v1/emails-check)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    mailcheck,
    emails: {
      propDefinition: [
        mailcheck,
        "emails",
      ],
    },
  },
  async run({ $ }) {
    try {
      const response = await this.mailcheck.createBatch({
        $,
        data: {
          emails: this.emails && parseObject(this.emails),
        },
      });

      $.export("$summary", `Batch check operation successfully created with name: ${response.name}`);
      return response;
    } catch (message) {
      throw new Error(JSON.parse(message).message);
    }
  },
};
