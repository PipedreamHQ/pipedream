import { prepareData } from "../../common/utils.mjs";
import constantContact from "../../constant_contact.app.mjs";

export default {
  key: "constant_contact-update-contact",
  name: "Update Contact",
  version: "0.0.1",
  description: "Update an existing contact. [See the documentation](https://developer.constantcontact.com/api_reference/index.html#!/Contacts/putContact)",
  type: "action",
  props: {
    constantContact,
    contactId: {
      propDefinition: [
        constantContact,
        "contactId",
      ],
    },
    emailAddress: {
      propDefinition: [
        constantContact,
        "emailAddress",
      ],
      optional: true,
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
    updateSource: {
      propDefinition: [
        constantContact,
        "createSource",
      ],
      label: "Update Source",
      description: "Describes who updated the contact. Your integration must accurately identify `update_source` for compliance reasons.",
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
      contactId,
      ...data
    } = this;

    const contact = await constantContact.getContact({
      $,
      contactId,
    });

    const preparedData = prepareData(contact, data);

    const response = await constantContact.updateContact({
      $,
      contactId,
      data: preparedData,
    });

    $.export("$summary", `The contact with id: ${contactId} was successfully updated!`);
    return response;
  },
};
