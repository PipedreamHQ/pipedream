import { parseObject } from "../../common/utils.mjs";
import nutshell from "../../nutshell.app.mjs";

export default {
  key: "nutshell-create-company",
  name: "Create Company",
  description: "Creates a new company within Nutshell. [See the documentation](https://developers-rpc.nutshell.com/detail/class_core.html#a491d4330ca35e5403edd48a2cfd3b275)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    nutshell,
    industryId: {
      propDefinition: [
        nutshell,
        "industryId",
      ],
      optional: true,
    },
    accountTypeId: {
      propDefinition: [
        nutshell,
        "accountTypeId",
      ],
      optional: true,
    },
    territoryId: {
      propDefinition: [
        nutshell,
        "territoryId",
      ],
      optional: true,
    },
    url: {
      type: "string[]",
      label: "URLs",
      description: "The URLs of the company.",
      optional: true,
    },
    email: {
      propDefinition: [
        nutshell,
        "email",
      ],
      optional: true,
    },
    phone: {
      propDefinition: [
        nutshell,
        "phone",
      ],
    },
    address: {
      propDefinition: [
        nutshell,
        "address",
      ],
      optional: true,
    },
    companyName: {
      propDefinition: [
        nutshell,
        "companyName",
      ],
      reloadProps: true,
    },
  },
  async additionalProps() {
    const { result: { Accounts: fields } } = await this.getCustomFields();
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
      const { result: { Accounts } } = await this.getCustomFields();

      let i = 0;
      for (const field of Accounts) {
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
      method: "newAccount",
      data: {
        params: {
          account: {
            name: this.companyName,
            industryId: this.industryId,
            accountTypeId: this.accountTypeId,
            territoryId: this.territoryId,
            location: this.location,
            url: this.url && parseObject(this.url),
            email: this.email && parseObject(this.email),
            phone: this.phone && parseObject(this.phone),
            address: this.address && parseObject(this.address),
            customFields,
          },
        },
      },
    });
    $.export("$summary", `Successfully created company with Id: ${response.result?.id}`);
    // Note: Left out the formatCompany for now to avoid breaking changes
    return response;
  },
};
