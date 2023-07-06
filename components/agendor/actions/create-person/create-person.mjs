import app from "../../agendor.app.mjs";

export default {
  name: "Create Person",
  description: "Create Person [See the documentation](https://api.agendor.com.br/docs/#operation/Create%20person).",
  key: "agendor-create-person",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    name: {
      type: "string",
      label: "Name",
      description: "Name of this person.",
    },
    cpf: {
      type: "string",
      label: "Legal Document Number (CPF)",
      description: "Legal document number (CPF)",
      optional: true,
    },
    organizationId: {
      propDefinition: [
        app,
        "organizationId",
      ],
      optional: true,
    },
    role: {
      type: "string",
      label: "Role",
      description: "Person's role in their organization",
      optional: true,
    },
    ranking: {
      propDefinition: [
        app,
        "ranking",
      ],
    },
    description: {
      propDefinition: [
        app,
        "description",
      ],
      description: "Your description of this person.",
    },
    birthday: {
      type: "string",
      label: "Birthday",
      description: "Person's birthday with or without year (`YYYY-MM-DD` or `MM-DD`).",
      optional: true,
    },
    ownerUser: {
      propDefinition: [
        app,
        "userId",
      ],
      description: "User ID or email of the owner of this person.",
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
      label: "Allowed Users",
      description: "Array of IDs of users that should be able to see this person.",
    },
    allowToAllUsers: {
      propDefinition: [
        app,
        "allowToAllUsers",
      ],
      description: "Set true if this person should be visible to all users.",
    },
    customFields: {
      propDefinition: [
        app,
        "customFields",
      ],
    },
  },
  async run({ $ }) {
    const person = await this.app.createPerson({
      name: this.name,
      cpf: this.cpf,
      organizationId: this.organizationId,
      role: this.role,
      ranking: this.ranking,
      description: this.description,
      birthday: this.birthday,
      ownerUser: this.ownerUser,
      contact: this.contact,
      address: this.address,
      leadOrigin: this.leadOrigin,
      category: this.category,
      products: this.products,
      allowedUsers: this.allowedUsers,
      allowToAllUsers: this.allowToAllUsers,
      customFields: this.customFields,
    });
    $.export("summary", "Person successfully created.");
    return person;
  },
};
