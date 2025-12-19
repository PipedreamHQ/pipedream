import easybroker from "../../easybroker.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "easybroker-create-contact-request",
  name: "Create Contact Request",
  description: "Creates or updates a new lead in EasyBroker that is interested in the provided property. [See the documentation](https://dev.easybroker.com/reference/post_contact-requests)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    easybroker,
    source: {
      type: "string",
      label: "Source",
      description: "The source of the contact request. Example: `mydomain.com`",
    },
    propertyId: {
      propDefinition: [
        easybroker,
        "propertyId",
      ],
      description: "The ID of the property to create the contact request for",
      optional: true,
    },
    name: {
      type: "string",
      label: "Name",
      description: "The name of the contact making the request",
    },
    email: {
      type: "string",
      label: "Email",
      description: "The email address of the contact making the request",
      optional: true,
    },
    phone: {
      type: "string",
      label: "Phone",
      description: "The phone number of the contact making the request",
      optional: true,
    },
    message: {
      type: "string",
      label: "Message",
      description: "The message from the contact making the request. Example: `I'm interested in the property.`",
      optional: true,
    },
  },
  async run({ $ }) {
    if (this.propertyId && (!this.email && !this.phone && !this.name)) {
      throw new ConfigurationError("You must provide at least the **Email**, **Phone**, or **Name** field when creating a contact request for a specific property.");
    }

    if (!this.propertyId && !this.name) {
      throw new ConfigurationError("You must provide the **Name** field when creating a contact request for a general lead.");
    }

    if (!this.propertyId && !this.email && !this.phone) {
      throw new ConfigurationError("You must provide either the **Email** or **Phone** field when creating a contact request for a general lead.");
    }

    if (!this.propertyId && !this.message) {
      throw new ConfigurationError("You must provide the **Message** field when creating a contact request for a general lead.");
    }

    const response = await this.easybroker.createContactRequest({
      $,
      data: {
        source: this.source,
        property_id: this.propertyId,
        name: this.name,
        email: this.email,
        phone: this.phone,
        message: this.message,
      },
    });
    $.export("$summary", "Successfully created contact request.");
    return response;
  },
};
