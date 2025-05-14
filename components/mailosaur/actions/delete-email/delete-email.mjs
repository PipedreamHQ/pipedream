import mailosaur from "../../mailosaur.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "mailosaur-delete-email",
  name: "Delete Email",
  description: "Deletes an email from a Mailosaur server using its email ID. [See the documentation](https://mailosaur.com/docs/api)",
  version: "0.0.1",
  type: "action",
  props: {
    mailosaur,
    emailId: {
      propDefinition: [
        mailosaur,
        "emailId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.mailosaur.deleteEmail({
      emailId: this.emailId,
    });
    $.export("$summary", `Successfully deleted email with ID ${this.emailId}`);
    return {
      success: true,
      emailId: this.emailId,
    };
  },
};
