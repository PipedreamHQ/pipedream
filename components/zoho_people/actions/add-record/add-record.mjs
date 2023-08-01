import app from "../../zoho_people.app.mjs";

export default {
  type: "action",
  key: "zoho_people-add_record",
  name: "Add Record",
  version: "0.0.1",
  description: "Add a record to a Zoho People module. [See the documentation](https://www.zoho.com/people/api/insert-records.html)",
  props: {
    app,
    form: {
      propDefinition: [
        app,
        "form",
      ],
      reloadProps: true,
    },
  },
  async additionalProps() {
    if (!this.form) {
      return;
    }

    const formProps = await this.app.listFieldsOfForm(this.form);
    const props = {};
    for (const field of formProps.response.result) {
      props[field.labelname] = {
        label: field.displayname,
        description: field.description,
        type: "string",
        default: field.autofillvalue,
        optional: !field.ismandatory,
      };

      if (field.Options) {
        const options = [];
        for (const optKey in field.Options) {
          if (typeof field.Options[optKey] === "string") {
            options.push(field.Options[optKey]);
          } else {
            options.push({
              label: field.Options[optKey].Value,
              value: field.Options[optKey].Id,
            });
          }
        }
        props[field.labelname].options = options;
      }
    }

    return props;
  },
  async run({ $ }) {
    const {
      app,
      form,
      ...data
    } = this;
    const res = await app.insertRecord(form, data);
    $.export("summary", `Record successfully created with id ${res.response.result.pkId}`);
    return res;
  },
};
