import { defineAction } from "@pipedream/types";
import app from "../../app/resend.app";

export default defineAction({
  name: "Retrieve Email",
  description:
    "Retrieve a single email [See the documentation](https://resend.com/docs/api-reference/emails/retrieve-email)",
  key: "resend-retrieve-email",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    emailId: {
      type: "string",
      label: "Email ID",
      description: "The Email ID.",
    },
  },
  async run({ $ }) {
    const { emailId } = this;
    const params = {
      $,
      emailId,
    };

    const response = await this.app.retrieveEmail(params);
    $.export("$summary", `Retrieved email (ID: ${emailId})`);
    return response;
  },
});
