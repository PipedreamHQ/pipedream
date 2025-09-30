import { ConfigurationError } from "@pipedream/platform";
import loops from "../../loops_so.app.mjs";

export default {
  key: "loops_so-delete-contact",
  name: "Delete Contact",
  description: "Delete an existing contact. [See the documentation](https://loops.so/docs/api-reference/delete-contact)",
  version: "0.0.3",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
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
    const {
      loops, email, userId,
    } = this;
    if (!email && !userId) {
      throw new ConfigurationError("You must provide either the contact's email address or user ID.");
    }
    const response = await loops.deleteContact({
      $,
      data: {
        email,
        userId,
      },
    });

    const summary = response?.success
      ? "Successfully deleted contact"
      : "Failed to delete contact";

    $.export("$summary", summary);

    return response;
  },
};
