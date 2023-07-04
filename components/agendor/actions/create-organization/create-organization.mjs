import app from "../../agendor.app.mjs";

export default {
  name: "Create Organization",
  description: "Create Organization [See the documentation](https://api.agendor.com.br/docs/#operation/Create%20organization).",
  key: "agendor-create-organization",
  version: "0.0.3",
  type: "action",
  props: {
    app,
    name: {
      type: "string",
      label: "Name",
      description: "Display name",
    },
    legalName: {
      type: "string",
      label: "Legal Name",
      description: "Legal name",
      optional: true,
    },
    cnpj: {
      type: "string",
      label: "Legal Document Number (CNPJ)",
      description: "Legal document number (CNPJ)",
      optional: true,
    },
    description: {
      type: "string",
      label: "Description",
      description: "Your description of this organization.",
      optional: true,
    },
    logo: {
      type: "string",
      label: "Logo",
      description: "URL of the logo",
      optional: true,
    },
    website: {
      type: "string",
      label: "Website",
      description: "URL of the website",
      optional: true,
    },
    ranking: {
      type: "string",
      label: "Ranking",
      description: "Ranking displayed as stars in the organization page.",
      optional: true,
      options: [
        "0",
        "1",
        "2",
        "3",
        "4",
        "5",
      ],
    },
    onwerUser: {
      propDefinition: [
        app,
        "userId",
      ],
    },
    contact: {
      type: "object",
      label: "Contact",
      description: "Contact information",
      optional: true,
    },
    address: {
      type: "object",
      label: "Address",
      description: "Address information",
      optional: true,
    },
    allowedUsers: {
      propDefinition: [
        app,
        "userId",
      ],
      type: "string[]",
      label: "Allowed Users",
      description: "Array of IDs of users that should be able to see this organization.",
    },
    allowToAllUsers: {
      type: "boolean",
      label: "Allow to All Users",
      description: "Set true if this organization should be visible to all users.",
      optional: true,
    },
    customFields: {
      type: "object",
      label: "Custom Fields",
      description: "Custom fields",
      optional: true,
    },
  },
  async run({ $ }) {
    const organization = await this.app.createOrganization({
      name: this.name,
      legalName: this.legalName,
      cnpj: this.cnpj,
      description: this.description,
      logo: this.logo,
      website: this.website,
      ranking: this.ranking,
      ownerUser: this.ownerUser,
      contact: this.contact,
      address: this.address,
      allowedUsers: this.allowedUsers,
      allowToAllUsers: this.allowToAllUsers,
      customFields: this.customFields,
    });
    $.export("summary", "Organization successfully created.");
    return organization;
  },
};
