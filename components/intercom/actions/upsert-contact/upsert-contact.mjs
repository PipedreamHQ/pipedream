import { ROLE_OPTIONS } from "../../common/constants.mjs";
import intercom from "../../intercom.app.mjs";

export default {
  key: "intercom-upsert-contact",
  name: "Upsert Contact",
  description: "Create a new contact. If there is already a contact with the email provided, the existing contact will be updated. [See the docs here](https://developers.intercom.com/docs/references/rest-api/api.intercom.io/contacts/createcontact)",
  version: "0.0.3",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    intercom,
    email: {
      type: "string",
      label: "Email",
      description: "The contact's email.",
    },
    role: {
      type: "string",
      label: "Role",
      description: "The role of the contact.",
      options: ROLE_OPTIONS,
      optional: true,
    },
    externalId: {
      type: "string",
      label: "External Id",
      description: "A unique identifier for the contact which is given to Intercom.",
      optional: true,
    },
    phone: {
      type: "string",
      label: "Phone",
      description: "The contact's phone number.",
      optional: true,
    },
    name: {
      type: "string",
      label: "Name",
      description: "The contact's name.",
      optional: true,
    },
    avatar: {
      type: "string",
      label: "Avatar",
      description: "An image URL containing the avatar of a contact.",
      optional: true,
    },
    unsubscribedFromEmails: {
      type: "boolean",
      label: "Unsubscribed From Emails",
      description: "Whether the contact is unsubscribed from emails.",
      optional: true,
    },
    customAttributes: {
      type: "object",
      label: "Custom Attributes",
      description: "The custom attributes which are set for the contact.",
      optional: true,
    },
  },
  async run({ $ }) {
    let response = {};
    let requestType = "created";
    let data = {
      email: this.email,
      role: this.role,
      externalId: this.externalId,
      phone: this.phone,
      name: this.name,
      avatar: this.avatar,
      unsubscribedFromEmails: this.unsubscribedFromEmails,
      customAttributes: this.customAttributes,
    };

    data = Object.entries(data).filter(([
      ,
      value,
    ]) => (value != "" && value != undefined))
      .reduce((obj, [
        key,
        value,
      ]) => Object.assign(obj, {
        [key]: value,
      }), {});

    const {
      data: contact, total_count: total,
    } = await this.intercom.searchContact({
      data: {
        query: {
          operator: "AND",
          value: [
            {
              field: "email",
              operator: "=",
              value: this.email,
            },
          ],
        },
        pagination: {
          per_page: 1,
        },
      },
    });

    if (total) {
      const {
        id: contactId,
        // eslint-disable-next-line no-unused-vars
        owner_id,
        ...contactInfos
      } = contact[0];
      response = await this.intercom.updateContact({
        $,
        contactId,
        data: {
          ...contactInfos,
          ...data,
        },
      });
      requestType = "updated";
    } else {
      response = await this.intercom.createContact({
        $,
        data,
      });
    }
    $.export("$summary", `Successfully ${requestType} contact with ID ${response.id}`);
    return response;
  },
};
