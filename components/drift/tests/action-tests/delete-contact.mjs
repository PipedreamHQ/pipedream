import drift from "../../drift.app.mjs";
import mockery$ from "../mockery-dollar.mjs";

const testAction = {
  mockery: {
    drift,
    // contactId: "25046815466", // optional
    email: "robert22o2@example.com", // optional
  },
  key: "drift-delete-contact",
  name: "Delete Contact",
  description: "Deletes a contact in Drift by ID or email. If both are provided, ID takes priority.",
  version: "0.0.2",
  type: "action",
  props: {
    drift,
    contactId: {
      type: "string",
      label: "Contact ID",
      description: "The contact's Drift ID. If provided, it will be used directly.",
      optional: true,
    },
    email: {
      type: "string",
      label: "Email",
      description: "The email of the contact to delete. Used only if ID is not provided.",
      optional: true,
    },
  },

  async run({ $ }) {
    
    const { drift, contactId, email } = this.mockery;

    let idToDelete = contactId;

    if (!idToDelete && email) {
      const response = await drift.methods.getContactByEmail({ $, params: { email } });
      if (!response?.data?.length) {
        throw new Error(`No contact found with email: ${email}`);
      }
      idToDelete = response.data[0].id;
    }

    if (!idToDelete) {
      throw new Error("You must provide either `contactId` or `email`.");
    }

    const response = await drift.methods.deleteContactById(idToDelete);

    $.export("$summary", `Contact ${idToDelete} deleted successfully.`);
    return {
      deleted: true,
      contactId: idToDelete,
      response,
    };
  },
};

// TEST (REMOVE IN PROD)
async function runTest() {
  await testAction.run(mockery$);
}

runTest();
