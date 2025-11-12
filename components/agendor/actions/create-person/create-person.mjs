import app from "../../agendor.app.mjs";

export default {
  name: "Create Person",
  description: "Create Person [See the documentation](https://api.agendor.com.br/docs/#operation/Create%20person).",
  key: "agendor-create-person",
  version: "0.0.3",
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
    const {
      app,
      ...data
    } = this;
    const person = await app.createPerson(data);
    $.export("summary", `Person successfully created with id "${person.data.id}".`);
    return person;
  },
};
