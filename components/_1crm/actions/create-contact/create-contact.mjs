import _1crm from "../../_1crm.app.mjs";

export default {
  key: "_1crm-create-contact",
  name: "Create Contact",
  description: "Creates a new contact in the 1CRM system. [See the documentation](https://demo.1crmcloud.com/api.php)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    _1crm,
    checkDuplicates: {
      type: "boolean",
      label: "Check Duplicates",
      description: "Check Duplicates Flag",
      reloadProps: true,
    },
  },
  async additionalProps() {
    const props = {};
    let { fields } = await this._1crm.getFields({
      module: "Contact",
    });
    console.log("fields: ", fields);

    fields = Object.keys(fields)
      .filter( (key) => !("editable" in key))
      .reduce( (res, key) => (res[key] = fields[key], res), {} );

    for (const [
      key,
      value,
    ] of Object.entries(fields)) {
      props[key] = {
        type: "string",
        label: value.vname,
        description: value.comment,
      };
    }
    return props;
  },
  async run({ $ }) {
    const response = await this._1crm.createContact({
      $,
      data: {
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        address: this.address,
        phoneNumber: this.phoneNumber,
      },
    });
    $.export("$summary", `Successfully created contact with ID ${response.id}`);
    return response;
  },
};
