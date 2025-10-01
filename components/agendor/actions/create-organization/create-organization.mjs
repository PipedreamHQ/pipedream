import app from "../../agendor.app.mjs";

export default {
  name: "Create Organization",
  description: "Create Organization [See the documentation](https://api.agendor.com.br/docs/#operation/Create%20organization).",
  key: "agendor-create-organization",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
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
      propDefinition: [
        app,
        "description",
      ],
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
      propDefinition: [
        app,
        "ranking",
      ],
    },
    onwerUser: {
      propDefinition: [
        app,
        "userId",
      ],
    },
    contact: {
      propDefinition: [
        app,
        "contact",
      ],
    },
    address: {
      propDefinition: [
        app,
        "address",
      ],
    },
    leadOrigin: {
      propDefinition: [
        app,
        "leadOrigin",
      ],
    },
    category: {
      propDefinition: [
        app,
        "category",
      ],
    },
    sector: {
      propDefinition: [
        app,
        "sector",
      ],
    },
    products: {
      propDefinition: [
        app,
        "product",
      ],
      type: "string[]",
      label: "Products",
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
      propDefinition: [
        app,
        "allowToAllUsers",
      ],
    },
    customFields: {
      propDefinition: [
        app,
        "customFields",
      ],
    },
  },
  async run({ $ }) {
    const {
      app,
      ...data
    } = this;
    const organization = await app.createOrganization(data);
    $.export("summary", `Organization successfully created with id "${organization.data.id}".`);
    return organization;
  },
};
