import { ConfigurationError } from "@pipedream/platform";
import constantContact from "../../constant_contact.app.mjs";

export default {
  key: "constant_contact-add-account-email-address",
  name: "Add An Account Email Address",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  description: "Add a new email address to your Constant Contact account. This action sends a confirmation email to the new address. Once confirmed, the email address can be used in the `from_email` and `reply_to_email` fields of your email campaigns. [See the documentation](https://developer.constantcontact.com/api_reference/index.html#tag/Account-Services/operation/addAccountEmailAddress)",
  type: "action",
  props: {
    constantContact,
    emailAddress: {
      type: "string",
      label: "Email Address",
      description: "The email address to add to your Constant Contact account.",
    },
  },
  async run({ $ }) {
    try {
      const response = await this.constantContact.addAccountEmailAddress({
        $,
        data: {
          email_address: this.emailAddress,
        },
      });

      $.export("$summary", `Successfully added email address \`${this.emailAddress}\` to account. A confirmation email has been sent.`);
      return response;
    } catch ({ response }) {
      if (response.data[0]?.error_key === "accountsvc.api.conflict") {
        throw new ConfigurationError("The email address you provided is already in use by another account. Please use a different email address.");
      }
      throw new Error(response.data[0]?.error_message);
    }
  },
};

