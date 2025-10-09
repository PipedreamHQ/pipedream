import { defineAction } from "@pipedream/types";
import nectar_crm from "../../app/nectar_crm.app";
import constants from "../common/constants";

export default defineAction({
  key: "nectar_crm-create-contact",
  name: "Create Contact",
  description: "Created a new contact. [See docs here](https://nectarcrm.docs.apiary.io/#reference/0/contatos/criar)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    nectar_crm,
    name: {
      label: "Name",
      description: "The name of the contact",
      type: "string",
    },
    cnpj: {
      label: "CNPJ",
      description: "The CNPJ of the contact. E.g. `99.999.999/9999-99`",
      type: "string",
      optional: true,
    },
    origin: {
      label: "Origin",
      description: "The origin of the contact. E.g. `Email`",
      type: "string",
      optional: true,
    },
    category: {
      label: "Category",
      description: "The category of the contact. E.g. `Active Customer`",
      type: "string",
      optional: true,
    },
    type: {
      label: "Type",
      description: "The type of the contact.",
      type: "string",
      options: constants.CONTACT_TYPES,
      optional: true,
    },
    observation: {
      label: "Observation",
      description: "The Observation about the contact",
      type: "string",
      optional: true,
    },
    email: {
      label: "Email",
      description: "The email of the contact",
      type: "string",
      optional: true,
    },
    phoneNumber: {
      label: "Phone Number",
      description: "The phone number of the contact",
      type: "string",
      optional: true,
    },
    active: {
      label: "Active",
      description: "If the contact is active",
      type: "boolean",
      default: true,
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.nectar_crm.createContact({
      $,
      data: {
        ativo: this.active,
        nome: this.name,
        cnpj: this.cnpj,
        origem: this.origin,
        categoria: this.category,
        constante: this.type,
        observacao: this.observation,
        emails: [
          this.email,
        ],
        telefones: [
          this.phoneNumber,
        ],
      },
    });

    $.export("$summary", `Successfully created contact with id ${response.id}`);

    return response;
  },
});
