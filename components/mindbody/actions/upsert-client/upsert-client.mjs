import app from "../../mindbody.app.mjs";

export default {
  key: "mindbody-upsert-client",
  name: "Upsert Client",
  description:
    "Creates a new client or updates an existing client record."
    + " **To create:** omit `clientId`. `firstName`, `lastName`, and `birthDate` are required for new clients."
    + " **To update:** provide `clientId` — only the fields you specify will be updated."
    + " BirthDate format: ISO datetime string `YYYY-MM-DDTHH:MM:SS` (e.g., `1990-05-15T00:00:00`)."
    + " Use **Search Clients** to find an existing client's ID before updating."
    + " [See the documentation](https://developers.mindbodyonline.com/PublicDocumentation/V6#tag/Client/operation/ClientService_AddClient)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    clientId: {
      propDefinition: [
        app,
        "clientId",
      ],
      description: "Existing client ID to update. Omit to create a new client.",
      optional: true,
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "Client's first name. Required when creating a new client.",
      optional: true,
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "Client's last name. Required when creating a new client.",
      optional: true,
    },
    birthDate: {
      type: "string",
      label: "Birth Date",
      description: "Client's date of birth. Required when creating a new client. Format: `YYYY-MM-DDTHH:MM:SS` (e.g., `1990-05-15T00:00:00`).",
      optional: true,
    },
    email: {
      type: "string",
      label: "Email",
      description: "Client's email address.",
      optional: true,
    },
    mobilePhone: {
      type: "string",
      label: "Mobile Phone",
      description: "Client's mobile phone number (digits only, e.g., `5551234567`).",
      optional: true,
    },
  },
  async run({ $ }) {
    let response;
    if (this.clientId) {
      // updateclient requires Client wrapper + CrossRegionalUpdate: false
      response = await this.app.updateClient({
        $,
        data: {
          Client: {
            Id: this.clientId,
            FirstName: this.firstName,
            LastName: this.lastName,
            BirthDate: this.birthDate,
            Email: this.email,
            MobilePhone: this.mobilePhone,
          },
          CrossRegionalUpdate: false,
        },
      });
      const c = response.Client || {};
      $.export("$summary", `Updated client ${c.Id}: ${c.FirstName} ${c.LastName}`);
    } else {
      const missing = [
        "firstName",
        "lastName",
        "birthDate",
      ].filter((f) => !this[f]);
      if (missing.length) {
        throw new Error(`Missing required fields for client creation: ${missing.join(", ")}`);
      }
      // addclient requires flat JSON body (no Client wrapper)
      response = await this.app.addClient({
        $,
        data: {
          FirstName: this.firstName,
          LastName: this.lastName,
          BirthDate: this.birthDate,
          Email: this.email,
          MobilePhone: this.mobilePhone,
        },
      });
      const c = response.Client || {};
      $.export("$summary", `Created client ${c.Id}: ${c.FirstName} ${c.LastName}`);
    }
    return response;
  },
};
