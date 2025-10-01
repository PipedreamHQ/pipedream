import { parseObject } from "../../common/utils.mjs";
import freshsales from "../../freshsales.app.mjs";

export default {
  key: "freshsales-create-contact",
  name: "Create Contact",
  description: "Create a new contact in your Freshsales account. [See the documentation](https://developer.freshsales.io/api/#create_a_contact)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    freshsales,
    email: {
      type: "string",
      label: "Email",
      description: "Email of the contact",
      reloadProps: true,
    },
  },
  async additionalProps() {
    const { fields } = await this.freshsales.getContactFields();
    const filteredFields = fields.filter((field) => (field.visible === true && field.name != "emails"));

    const props = {};
    for (const field of filteredFields) {

      const data = {
        type: field.type === "multi_select_dropdown"
          ? "string[]"
          : "string",
        label: field.label,
        description: `${field.label} of the contact.`,
        optional: field.required === false,
      };

      if (field.name === "sales_accounts") {
        const { sales_accounts: options } = await this.freshsales.getSalesAccounts();
        const salesAccountOptions = options.map((account) => ({
          label: account.name,
          value: `${account.id}`,
        }));
        props.primaryAccount = {
          type: "string",
          label: "Primary Sales Account",
          description: "Primary sales account of the contact.",
          optional: true,
          options: salesAccountOptions,
        };
        props.additionalAccounts = {
          type: "string[]",
          label: "Additional Sales Accounts",
          description: "Additional sales accounts of the contact.",
          optional: true,
          options: salesAccountOptions,
        };
      } else {
        if ([
          "dropdown",
          "multi_select_dropdown",
        ].includes(field.type)) {
          data.type = "integer";
          data.options = field.choices.map((choice) => ({
            label: choice.value,
            value: choice.id,
          }));
        }
        props[field.name] = data;
      }
    }

    return props;
  },
  async run({ $ }) {

    const {
      freshsales,
      ...data
    } = this;

    if (data.primaryAccount) {
      data.sales_accounts = [
        {
          id: data.primaryAccount,
          is_primary: true,
        },
      ];
      parseObject(data.additionalAccounts)?.map((account) => {
        data.sales_accounts.push(
          {
            id: account,
            is_primary: false,
          },
        );
      });
      delete data.primaryAccount;
      delete data.additionalAccounts;
    }

    const response = await freshsales.createContact({
      $,
      data,
    });

    $.export("$summary", `Successfully created contact with ID: ${response.contact.id}`);
    return response;
  },
};
