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
      const clientData = {
        Id: this.clientId,
      };
      if (this.firstName !== undefined) clientData.FirstName = this.firstName;
      if (this.lastName !== undefined) clientData.LastName = this.lastName;
      if (this.birthDate !== undefined) clientData.BirthDate = this.birthDate;
      if (this.email !== undefined) clientData.Email = this.email;
      if (this.mobilePhone !== undefined) clientData.MobilePhone = this.mobilePhone;
      response = await this.app.updateClient({
        $,
        data: {
          Client: clientData,
          CrossRegionalUpdate: false,
        },
      });
      const c = response.Client || {};
      $.export("$summary", `Updated client ${c.Id}: ${c.FirstName} ${c.LastName}`);
    } else {
      // addclient requires flat JSON body (no Client wrapper)
      const body = {};
      if (this.firstName !== undefined) body.FirstName = this.firstName;
      if (this.lastName !== undefined) body.LastName = this.lastName;
      if (this.birthDate !== undefined) body.BirthDate = this.birthDate;
      if (this.email !== undefined) body.Email = this.email;
      if (this.mobilePhone !== undefined) body.MobilePhone = this.mobilePhone;
      response = await this.app.addClient({
        $,
        data: body,
      });
      const c = response.Client || {};
      $.export("$summary", `Created client ${c.Id}: ${c.FirstName} ${c.LastName}`);
    }
    return response;
  },
};
