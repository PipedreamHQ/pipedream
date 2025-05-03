import drift from "../../drift.app.mjs";
import mockery$ from "../mockery-dollar.mjs";

const mockeryData = {
  drift: drift,
  emailOrId: "25062508963",
};

const testAction = {
  mockery: {
    drift,
    ...mockeryData,
  }, // TEST

  key: "drift-delete-contact-test",
  name: "Delete Contact",
  description: "Deletes a contact in Drift by ID or email. [See the docs](https://devdocs.drift.com/docs/removing-a-contact).",
  version: "0.0.4",
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

    const { drift } = this.mockery;

    const emailOrId = drift.methods.trimIfString(this.mockery.emailOrId);

    warnings.push(...drift.methods.checkEmailOrId(emailOrId));

    const response = await drift.methods.getContactByEmailOrId($, emailOrId);

    const contact = response.data[0] || response.data;

    console.log(contact);

    $.export("$summary", `Contact ${contact.attributes.email} ID "${contact.id}"`
      + " fetched successfully.");

    return contact;
  },
};

// TEST (FIX IN PRODUCTION)
// await is just in case if node wants to finish its job before time =)
async function runTest() {
  await testAction.run(mockery$);
}

runTest();

