import drift from "../../drift.app.mjs";
import mockery$ from "../mockery-dollar.mjs";
import { removeNullEntries } from "../../common/utils.mjs";

const mockeryData = {

  drift: drift,
  emailOrId: "25062508963",

  name: "Boberto McTestface",
  phone: "+aaaaaaaaaa",
  customAttributes: {
    job_title: "fgfffffff",
    company: "ffffffffffffff",
    location: "fffffffffaaaaaaaaa",
    start_date: 111111241,
    some_field: "new field",
    email: "steve@gmail.com",
  },
};

const testAction = {
  mockery: {
    drift,
    ...mockeryData,
  }, // TEST
  key: "drift-update-contact",
  name: "Update Contact",
  description: "Updates a contact in Drift using ID or email. Only changed attributes will be updated. [See Drift API docs](https://devdocs.drift.com/docs/updating-a-contact)",
  version: "0.0.2",
  type: "action",
  props: {
    drift,
    emailOrId: {
      type: "string",
      label: "Email or ID",
      description: "The contact’s email address or numeric ID.",
    },
    name: {
      type: "string",
      label: "Name",
      description: "The contact’s name.",
      optional: true,
    },
    phone: {
      type: "string",
      label: "Phone",
      description: "The contact’s phone number.",
      optional: true,
    },
    customAttributes: {
      type: "object",
      label: "Custom Attributes",
      description: "Any custom attributes to update (e.g. company, job title, etc).",
      optional: true,
    },
  },

  async run({ $ }) {
    const warnings = [];
    const {
      drift, name, phone,
    } = this.mockery;

    const customAttributes = drift.methods.parseIfJSONString(this.mockery.customAttributes);

    const attributes = removeNullEntries({
      name,
      phone,
      ...customAttributes,
    });

    if (!Object.keys(attributes).length) {
      throw new Error("No attributes provided to update.");
    };

    const emailOrId = drift.methods.trimIfString(this.mockery.emailOrId);

    warnings.push(...drift.methods.checkEmailOrId(emailOrId));

    let contact = await drift.methods.getContactByEmailOrId($, emailOrId);

    const contactId = contact.data[0]?.id || contact.data.id;

    const response = await drift.methods.updateContact({
      $,
      contactId,
      data: {
        attributes,
      },
    });

    $.export("$summary", `Contact ID ${contactId} updated successfully.`);
    return response;
  },
};

// TEST (FIX IN PRODUCTION)
// await is just in case if node wants to finish its job before time =)
async function runTest() {
  await testAction.run(mockery$);
}

runTest();

