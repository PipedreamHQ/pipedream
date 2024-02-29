import { parseObject } from "../../common/utils.mjs";
import nutshell from "../../nutshell.app.mjs";

export default {
  key: "nutshell-create-lead",
  name: "Create Lead",
  description: "Initiates a new lead within Nutshell. [See the documentation](https://developers.nutshell.com)",
  version: "0.0.1",
  type: "action",
  props: {
    nutshell,
    marketId: {
      propDefinition: [
        nutshell,
        "marketId",
      ],
      optional: true,
    },
    tags: {
      type: "string[]",
      label: "Tags",
      description: "A list of tags.",
      optional: true,
    },
    accountId: {
      propDefinition: [
        nutshell,
        "accountId",
      ],
      type: "string[]",
      optional: true,
    },
    contactId: {
      propDefinition: [
        nutshell,
        "contactId",
      ],
      type: "string[]",
      optional: true,
    },
    description: {
      propDefinition: [
        nutshell,
        "description",
      ],
      reloadProps: true,
    },
  },
  async additionalProps() {
    const { result: { Leads: fields } } = await this.getCustomFields();
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
      const { result: { Leads } } = await this.getCustomFields();

      let i = 0;
      for (const field of Leads) {
        i++;
        if (props[`customField_${i}`]) {
          customFields[field.name] = props[`customField_${i}`];
        }
      }
      return customFields;
    },
  },
  async run({ $ }) {
    const customFields = await this.parseCustomFields(this);
    const response = await this.nutshell.post({
      $,
      method: "newLead",
      data: {
        params: {
          lead: {
            market: this.marketId && {
              id: this.marketId,
            },
            tags: this.tags && parseObject(this.tags),
            description: this.description,
            accounts: this.accountId && this.accountId.map((account) => ({
              id: account,
            })),
            contacts: this.contactId && this.contactId.map((contact) => ({
              id: contact,
            })),
            customFields,
          },
        },
      },
    });
    $.export("$summary", `Successfully created lead with Id: ${response.result.id}`);
    return response;
  },
};
