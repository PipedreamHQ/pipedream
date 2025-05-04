import drift from "../../drift.app.mjs";
import mockery$ from "../mockery-dollar.mjs";
import { removeNullEntries } from "../../common/utils.mjs";

const mockeryData = {
  drift: drift,
  email: "newlyyyy@mail.com",
  name: "Boberto McTestface",
  phone: "+1234567123",
  customAttributes: {
    job_title: "Software Engineer",
    company: "OpenAI",
    location: "San Francisco",
  },
};

const testAction = {
  mockery: {
    drift,
    ...mockeryData,
  }, // TEST
  key: "drift-create-contact-test",
  name: "Create Contact",
  description: "Creates a contact in Drift. [See the docs](https://devdocs.drift.com/docs/creating-a-contact).",
  version: "0.0.1",
  type: "action",
  props: {
    drift,
    email: {
      type: "string",
      label: "Email",
      description: "The contact's email address",
    },
    name: {
      type: "string",
      label: "Name",
      description: "The contact's full name",
      optional: true,
    },
    phone: {
      type: "string",
      label: "Phone",
      description: "The contact's phone number",
      optional: true,
    },
    source: {
      type: "string",
      label: "Lead Source",
      description: "The value of the 'lead_create_source' custom attribute to match (case-sensitive).",
      optional: true,
    },
    customAttributes: {
      type: "object",
      label: "Custom Attributes",
      description: "Additional custom attributes to store on the contact",
      optional: true,
    },
  },

  async run({ $ }) {

    const warnings = [];

    const {
      drift, email, name, phone, source,
    } = this.mockery;

    warnings.push(...drift.methods.checkIfEmailValid(email));

    const customAttributes = drift.methods.parseIfJSONString(this.mockery.customAttributes);

    const attributes = removeNullEntries({
      email,
      name,
      phone,
      source,
      ...customAttributes,
    });

    const existingContact = await drift.methods.getContactByEmail({
      $,
      params: {
        email,
      },
    });

    if (existingContact && existingContact.data.length > 0) {
      throw new Error (`Contact ${email} already exists`);
    };

    const response = await drift.methods.createContact({
      $,
      data: {
        attributes,
      },
    });

    console.log(response.data.id);

    $.export("$summary", `Contact ${email} created.` + "\n- "  + warnings.join("\n- "));
    return response;
  },
};

// TEST (FIX IN PRODUCTION)
// await is just in case if node wants to finish its job before time =)
async function runTest() {
  await testAction.run(mockery$);
}

runTest();
