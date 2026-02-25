import { parseObject } from "../../common/utils.mjs";
import nutshell from "../../nutshell.app.mjs";

export default {
  key: "nutshell-create-contact",
  name: "Create Contact",
  description: "Creates a new contact. [See the documentation](https://developers.nutshell.com/detail/class_core.html#a4b40d4fe9c7b8ddfd7231aca65cd1556)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    nutshell,
    name: {
      type: "string",
      label: "Name",
      description: "The name to the contact.",
      optional: true,
    },
    phone: {
      propDefinition: [
        nutshell,
        "phone",
      ],
      description: "The phone numbers of the contact.",
    },
    email: {
      propDefinition: [
        nutshell,
        "email",
      ],
      description: "The email address of the contact.",
    },
    address: {
      propDefinition: [
        nutshell,
        "address",
      ],
      optional: true,
    },
    companyId: {
      propDefinition: [
        nutshell,
        "companyId",
      ],
      type: "string[]",
      description: "The company ID for the contact.",
      optional: true,
    },
    accountId: {
      propDefinition: [
        nutshell,
        "accountId",
      ],
      type: "string[]",
      description: "**Deprecated**: Use `companyId` instead. The account ID for the contact.",
      optional: true,
    },
    leadId: {
      propDefinition: [
        nutshell,
        "leadId",
        ({
          companyId, accountId,
        }) => ({
          companyId: companyId ?? accountId,
        }),
      ],
      optional: true,
    },
    territoryId: {
      propDefinition: [
        nutshell,
        "territoryId",
      ],
      description: "The territory of the contact.",
      optional: true,
    },
    audienceId: {
      propDefinition: [
        nutshell,
        "audienceId",
      ],
      optional: true,
    },
    description: {
      propDefinition: [
        nutshell,
        "description",
      ],
      description: "A description to identify the new contact.",
      reloadProps: true,
    },
  },
  async additionalProps() {
    const { result: { Contacts: fields } } = await this.getCustomFields();
    const props = {};
    let i = 0;
    for (const field of fields) {
      i++;
      props[`customField_${i}`] = {
        type: "string",
        label: field.name,
        description: `Custom field ${i}.`,
        optional: true,
      };
    }
    return props;
  },
  methods: {
    async getCustomFields() {
      return await this.nutshell.post({
        method: "findCustomFields",
      });
    },
    async parseCustomFields(props) {
      const customFields = {};
      const { result: { Contacts } } = await this.getCustomFields();

      let i = 0;
      for (const field of Contacts) {
        i++;
        if (props[`customField_${i}`]) {
          customFields[field.name] = props[`customField_${i}`];
        }
      }
      return customFields;
    },
  },
  async run({ $ }) {

    // To keep backwards compatibility, but maintain consistency across the original conventions.
    // we are setting the companyId to the accountId if it is provided.
    if (this.accountId && !this.companyId) {
      this.companyId = this.accountId;
    }

    const customFields = await this.parseCustomFields(this);
    const response = await this.nutshell.post({
      $,
      method: "newContact",
      data: {
        params: {
          contact: {
            name: this.name,
            description: this.description,
            phone: this.phone && parseObject(this.phone),
            email: this.email && parseObject(this.email),
            address: this.address && parseObject(this.address),
            leads: this.leadId && this.leadId.map((lead) => ({
              id: lead,
            })),
            accounts: this.companyId && this.companyId.map((company) => ({
              id: company,
            })),
            territoryId: this.territoryId,
            audienceId: this.audienceId && this.audienceId.map((audience) => ({
              id: audience,
            })),
            customFields,
          },
        },
      },
    });

    $.export("$summary", `New contact created with Id: ${response.result?.id}`);
    // Note: Left out the formatContact for now to avoid breaking changes
    return response;
  },
};
