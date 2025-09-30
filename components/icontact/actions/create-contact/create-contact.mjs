import { STATUS_OPTIONS } from "../../common/constants.mjs";
import { checkWarnings } from "../../common/utils.mjs";
import icontact from "../../icontact.app.mjs";

export default {
  key: "icontact-create-contact",
  name: "Create Contact",
  description: "Creates a new contact within the iContact account. [See the documentation](https://help.icontact.com/customers/s/article/Contacts-iContact-API?r=153&ui-knowledge-components-aura-actions.KnowledgeArticleVersionCreateDraftFromOnlineAction.createDraftFromOnlineArticle=1)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    icontact,
    email: {
      type: "string",
      label: "Email",
      description: "The contact's email address. **Note: The email address must be unique**.",
    },
    prefix: {
      type: "string",
      label: "Prefix",
      description: "The contact's salutation. **E.g. Miss**",
      optional: true,
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "The contact's first name.",
      optional: true,
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "The contact's last name.",
      optional: true,
    },
    suffix: {
      type: "string",
      label: "Suffix",
      description: "The contact's name qualifications **E.g. III**.",
      optional: true,
    },
    street: {
      type: "string",
      label: "Street",
      description: "The contact's street address information.",
      optional: true,
    },
    street2: {
      type: "string",
      label: "Street 2",
      description: "The contact's line 2 information.",
      optional: true,
    },
    city: {
      type: "string",
      label: "City",
      description: "The contact's city information.",
      optional: true,
    },
    state: {
      type: "string",
      label: "State",
      description: "The contact's state information.",
      optional: true,
    },
    postalCode: {
      type: "string",
      label: "Postal Code",
      description: "The contact's postal code information.",
      optional: true,
    },
    phone: {
      type: "string",
      label: "Phone",
      description: "The contact's phone number.",
      optional: true,
    },
    fax: {
      type: "string",
      label: "Fax",
      description: "The contact's fax number.",
      optional: true,
    },
    business: {
      type: "string",
      label: "Business",
      description: "The contact's business phone number.",
      optional: true,
    },
    status: {
      type: "string",
      label: "Status",
      description: "The subscription status of the contact.",
      options: STATUS_OPTIONS,
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      icontact,
      ...contact
    } = this;

    const { contacts } = await icontact.searchContact({
      params: {
        email: contact.email,
      },
    });

    if (contacts.length) throw new Error("A contact with the provided email already exists.");

    const response = await icontact.createContact({
      $,
      data: {
        contact,
      },
    });

    checkWarnings(response);

    $.export("$summary", `Successfully created contact with ID: ${response.contacts[0].contactId}`);
    return response.contacts[0];
  },
};
