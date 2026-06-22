import { parseObject } from "../../common/utils.mjs";
import { ENTITY_KEYS } from "../../common/constants.mjs";
import nutshell from "../../nutshell.app.mjs";

export default {
  key: "nutshell-create-contact",
  name: "Create Contact",
  description: "Create a new contact (person) in Nutshell. [See the documentation](https://developers.nutshell.com/reference/376a09558c05d3d4d273459f15a57326)",
  version: "0.0.6",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    nutshell,
    firstName: {
      type: "string",
      label: "First Name",
      description: "Contact first name.",
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "Contact last name.",
      optional: true,
    },
    email: {
      type: "string[]",
      label: "Email",
      description: "Array of email objects as JSON strings, e.g. `{\"isPrimary\":true,\"value\":\"jane@acme.com\"}`.",
      optional: true,
    },
    phone: {
      type: "string[]",
      label: "Phone",
      description: "Array of phone objects as JSON strings, e.g. `{\"isPrimary\":true,\"value\":\"+15125551234\"}`.",
      optional: true,
    },
    jobTitle: {
      type: "string",
      label: "Job Title",
      description: "Contact job title.",
      optional: true,
    },
    companyId: {
      propDefinition: [
        nutshell,
        "companyId",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const contactData = {
      name: {
        givenName: this.firstName,
        familyName: this.lastName,
      },
      title: this.jobTitle,
      ...(this.email
        ? {
          email: parseObject(this.email),
        }
        : {}),
      ...(this.phone
        ? {
          phone: parseObject(this.phone),
        }
        : {}),
      ...(this.companyId
        ? {
          links: {
            accounts: [
              this.companyId,
            ],
          },
        }
        : {}),
    };

    const contact = await this.nutshell.createContact({
      $,
      data: {
        [ENTITY_KEYS.CONTACTS]: [
          contactData,
        ],
      },
    });

    const displayName = typeof contact?.name === "object"
      ? ((contact.name?.displayName
        ?? [
          contact.name?.givenName,
          contact.name?.familyName,
        ].filter(Boolean).join(" "))
        || contact?.id)
      : (contact?.name ?? contact?.id);

    $.export("$summary", `New contact created: "${displayName}" (ID: ${contact?.id})`);
    return this.nutshell.formatContact(contact);
  },
};
