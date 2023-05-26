import constantContact from "../../constant_contact.app.mjs";

export default {
  key: "constant_contact-add-contact",
  name: "Add Contact",
  version: "0.0.1",
  description: "Add a single contact. [See the documentation](https://developer.constantcontact.com/api_reference/index.html#!/Contacts/createContact)",
  type: "action",
  props: {
    constantContact,
    emailAddress: {
      propDefinition: [
        constantContact,
        "emailAddress",
      ],
    },
    permissionToSend: {
      propDefinition: [
        constantContact,
        "permissionToSend",
      ],
      optional: true,
    },
    firstName: {
      propDefinition: [
        constantContact,
        "firstName",
      ],
      optional: true,
    },
    lastName: {
      propDefinition: [
        constantContact,
        "lastName",
      ],
      optional: true,
    },
    jobTitle: {
      propDefinition: [
        constantContact,
        "jobTitle",
      ],
      optional: true,
    },
    companyName: {
      propDefinition: [
        constantContact,
        "companyName",
      ],
      optional: true,
    },
    createSource: {
      propDefinition: [
        constantContact,
        "createSource",
      ],
    },
    birthdayMonth: {
      propDefinition: [
        constantContact,
        "birthdayMonth",
      ],
      optional: true,
    },
    birthdayDay: {
      propDefinition: [
        constantContact,
        "birthdayDay",
      ],
      optional: true,
    },
    anniversary: {
      propDefinition: [
        constantContact,
        "anniversary",
      ],
      optional: true,
    },
    customFields: {
      propDefinition: [
        constantContact,
        "customFields",
      ],
      optional: true,
    },
    phoneNumbers: {
      propDefinition: [
        constantContact,
        "phoneNumbers",
      ],
      optional: true,
    },
    streetAddresses: {
      propDefinition: [
        constantContact,
        "streetAddresses",
      ],
      optional: true,
    },
    listMembership: {
      propDefinition: [
        constantContact,
        "listMembership",
      ],
      optional: true,
    },
    taggings: {
      propDefinition: [
        constantContact,
        "taggings",
      ],
      optional: true,
    },
    notes: {
      propDefinition: [
        constantContact,
        "notes",
      ],
      optional: true,
    },
  },
  async run({ $ }) {

    const {
      constantContact,
      emailAddress,
      permissionToSend,
      firstName,
      lastName,
      jobTitle,
      companyName,
      createSource,
      birthdayMonth,
      birthdayDay,
      customFields,
      phoneNumbers,
      streetAddresses,
      listMembership,
      notes,
      ...data
    } = this;

    const response = await constantContact.createContact({
      $,
      data: {
        ...data,
        email_address: {
          address: emailAddress,
          permission_to_send: permissionToSend || null,
        },
        first_name: firstName || null,
        last_name: lastName || null,
        job_title: jobTitle || null,
        company_name: companyName || null,
        create_source: createSource || null,
        birthday_month: birthdayMonth || null,
        birthday_day: birthdayDay || null,
        custom_fields: customFields
          ? customFields.map((item) => JSON.parse(item))
          : null,
        phone_numbers: phoneNumbers
          ? phoneNumbers.map((item) => JSON.parse(item))
          : null,
        street_addresses: streetAddresses
          ? streetAddresses.map((item) => JSON.parse(item))
          : null,
        list_memberships: listMembership || null,
        notes: notes
          ? notes.map((item) => JSON.parse(item))
          : null,
      },
    });

    $.export("$summary", `A new contact with id: ${response.contact_id} was successfully created!`);
    return response;
  },
};
