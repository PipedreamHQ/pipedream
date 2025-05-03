import drift from "../../drift.app.mjs";

export default  {
  key: "drift-get-contact-test",
  name: "Delete Contact",
  description: "Deletes a contact in Drift by ID or email. [See the docs](https://devdocs.drift.com/docs/retrieving-contact).",
  version: "0.0.3",
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

    let contact;

    if (drift.isIdNumber(Number(emailOrId))) {

      const contactId = Number(emailOrId);

      let response;
      try {
        response = await drift.getContactById({
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

      contact = response.data;

    } else {
      const email = emailOrId;
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

      contact = response.data[0];
    };

    console.log(contact);

    $.export("$summary", `Contact ${contact.attributes.email} ID "${contact.id}"`
      + " fetched successfully.");

    return contact;
  },
};

