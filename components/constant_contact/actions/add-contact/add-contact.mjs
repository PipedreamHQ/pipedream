import { prepareData } from "../../common/utils.mjs";
import constantContact from "../../constant_contact.app.mjs";

export default {
  key: "constant_contact-add-contact",
  name: "Add Contact",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  description: "Add a single contact. [See the documentation](https://developer.constantcontact.com/api_reference/index.html#!/Contacts/createContact)",
  type: "action",
  props: {
    constantContact,
    emailAddress: {
      propDefinition: [
        constantContact,
        "emailAddress",
      ],
      reloadProps: true,
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
    numberOfPhoneNumbers: {
      propDefinition: [
        constantContact,
        "numberOfPhoneNumbers",
      ],
      optional: true,
      reloadProps: true,
    },
    numberOfStreetAddresses: {
      propDefinition: [
        constantContact,
        "numberOfStreetAddresses",
      ],
      optional: true,
      reloadProps: true,
    },
    listMemberships: {
      propDefinition: [
        constantContact,
        "listMemberships",
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
    numberOfNotes: {
      propDefinition: [
        constantContact,
        "numberOfNotes",
      ],
      optional: true,
      reloadProps: true,
    },
  },
  async additionalProps() {
    const props = {};
    const { custom_fields: customFields } = await this.listCustomFields();

    for (let i = 0; i < customFields.length; i++) {
      props[`customField_${customFields[i].custom_field_id}`] = {
        type: "string",
        label: `Custom Field ${i + 1} - ${customFields[i].label}`,
        description: "The content of the custom field.",
        optional: true,
      };
    }

    for (let i = 0; i < this.numberOfPhoneNumbers; i++) {
      props[`phoneNumberKind_${i}`] = {
        type: "string",
        label: `Phone Number Kind ${i + 1}`,
        description: `The kind of the phone number ${i + 1}.`,
        options: [
          "home",
          "work",
          "mobile",
          "other",
        ],
      };
      props[`phoneNumberValue_${i}`] = {
        type: "string",
        label: `Phone Number Value ${i + 1}`,
        description: `The value of the phone number ${i + 1}.`,
      };
    }

    for (let i = 0; i < this.numberOfStreetAddresses; i++) {
      props[`streetAddressKind_${i}`] = {
        type: "string",
        label: `Address Kind ${i + 1}`,
        description: `The kind of the address ${i + 1}.`,
        options: [
          "home",
          "work",
          "other",
        ],
      };
      props[`streetAddressStreet_${i}`] = {
        type: "string",
        label: `Address Street ${i + 1}`,
        description: `The street of the address ${i + 1}.`,
      };
      props[`streetAddressCity_${i}`] = {
        type: "string",
        label: `Address City ${i + 1}`,
        description: `The city of the address ${i + 1}.`,
      };
      props[`streetAddressState_${i}`] = {
        type: "string",
        label: `Address State ${i + 1}`,
        description: `The state of the address ${i + 1}.`,
      };
      props[`streetAddressPostalCode_${i}`] = {
        type: "string",
        label: `Address Postal Code ${i + 1}`,
        description: `The postal code of the address ${i + 1}.`,
      };
      props[`streetAddressCountry_${i}`] = {
        type: "string",
        label: `Address Country ${i + 1}`,
        description: `The country of the address ${i + 1}.`,
      };
    }

    for (let i = 0; i < this.numberOfNotes; i++) {
      props[`notes_${i}`] = {
        type: "string",
        label: `Note ${i + 1}`,
        description: "The content of the note.",
      };
    }

    return props;
  },
  methods: {
    listCustomFields() {
      return this.constantContact.listCustomFields();
    },
  },
  async run({ $ }) {
    const {
      constantContact,
      ...data
    } = this;

    const preparedData = await prepareData({}, data, this.listCustomFields);

    const response = await constantContact.createContact({
      $,
      data: preparedData,
    });

    $.export("$summary", `A new contact with id: ${response.contact_id} was successfully created!`);
    return response;
  },
};
