import { ConfigurationError } from "@pipedream/platform";
import loops from "../../loops_so.app.mjs";

export default {
  key: "loops_so-delete-contact",
  name: "Delete Contact",
  description: "Updates an existing contact by email. If email not found, a new contact will be created. [See the Documentation](https://loops.so/docs/add-users/api-reference#update)",
  version: "0.1.0",
  type: "action",
  props: {
    loops,
    infoAlert: {
      type: "alert",
      alertType: "info",
      content: "You can provide either the contact's email address or user ID.",
    },
    email: {
      propDefinition: [
        loops,
        "email",
      ],
      optional: true,
    },
    userId: {
      type: "string",
      label: "User ID",
      description: "User ID of the contact",
      optional: true,
    },
  },
  async run({ $ }) {
    const { // eslint-disable-next-line no-unused-vars
      loops, infoAlert, ...data
    } = this;
    if (!data) {
      throw new ConfigurationError("You must provide either the contact's email address or user ID.");
    }
    const response = await loops.deleteContact({
      $,
      data,
    });

    const summary = response?.success
      ? "Successfully deleted contact"
      : "Failed to delete contact";

    $.export("$summary", summary);

    return response;
  },
};
