import drift from "../../drift.app.mjs";

export default {
  key: "drift-delete-contact-test",
  name: "Delete Contact",
  description: "Deletes a contact in Drift by ID or email. [See the docs](https://devdocs.drift.com/docs/removing-a-contact).",
  version: "0.0.10",
  type: "action",
  props: {
    drift,
    emailOrId: {
      type: "string",
      label: "Email or Id",
      description: "The contact's email address or ID",
    },
  },

  async run({ $ }) {

    const warnings = [];

    const { drift } = this;

    const emailOrId = drift.trimIfString(this.emailOrId);

    warnings.push(...drift.checkEmailOrId(emailOrId));

    let contactId;
    let email;

    if (drift.isIdNumber(Number(emailOrId))) {

      contactId = Number(emailOrId);
      // Drift's response always returns 204 (No Content) on both successful and failed deletions.
      // So fetch the contact first and throw early if it is not found.
      try {
        await drift.getContactById({
          $,
          contactId,
        });
      } catch (error) {
        if (error.status === 404) {
          throw new Error(`No contact found with ID: ${contactId}`);
        } else {
          throw error;
        };
      }

    } else {
      email = emailOrId;
      // returns { data: [] } if not found.
      const response = await drift.getContactByEmail({
        $,
        params: {
          email,
        },
      });
      if (!response?.data?.length) {
        throw new Error(`No contact found with email: ${email}` +
              "\n- "  + warnings.join("\n- "));
      };

      contactId = response.data[0].id;
    };

    const response = await drift.deleteContactById({
      $,
      contactId,
    });

    email = (email)
      ? "\"" + email + "\""
      : "";

    $.export("$summary", `Contact ${email} ID "${contactId}" deleted successfully.`);

    return response;
  },
};

