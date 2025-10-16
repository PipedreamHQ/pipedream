import freshsales from "../../freshsales.app.mjs";

export default {
  key: "freshsales-create-deal",
  name: "Create Deal",
  description: "Create a new deal in your Freshsales account. [See the documentation](https://developer.freshsales.io/api/#create_deal)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    freshsales,
    name: {
      type: "string",
      label: "Name",
      description: "Name of the deal",
      reloadProps: true,
    },
  },
  async additionalProps() {
    const { fields } = await this.freshsales.getDealFields();
    const filteredFields = fields.filter((field) => (field.visible === true && field.name != "name"));

    const props = {};
    for (const field of filteredFields) {

      const data = {
        type: field.type === "multi_select_dropdown"
          ? "string[]"
          : "string",
        label: field.label,
        description: `${field.label} of the deal.`,
        optional: field.required === false,
      };

      if (field.name === "sales_account_id") {
        const { sales_accounts: options } = await this.freshsales.getSalesAccounts();
        data.type = "integer";
        data.label = "Sales Account";
        data.description = "Sales account of the deal.";
        data.optional = true;
        data.options = options.map((account) => ({
          label: account.name,
          value: account.id,
        }));
      }

      if (field.name === "contacts") {
        const { contacts: options } = await this.freshsales.getContacts();
        data.type = "integer[]";
        data.label = "Contacts";
        data.description = "Contacts of the deal.";
        data.optional = true;
        data.options = options.map((contact) => ({
          label: contact.display_name,
          value: contact.id,
        }));
      }

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

    return props;
  },
  async run({ $ }) {

    const {
      freshsales,
      ...data
    } = this;

    const response = await freshsales.createDeal({
      $,
      data,
    });

    $.export("$summary", `Successfully created deal with ID: ${response.deal.id}`);
    return response;
  },
};
