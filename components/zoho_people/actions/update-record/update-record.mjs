import app from "../../zoho_people.app.mjs";
import { getAdditionalProps } from "../common/add-update-record-common.mjs";

export default {
  type: "action",
  key: "zoho_people-update-record",
  name: "Update Record",
  version: "0.0.1",
  description: "Update a record to a Zoho People module. [See the documentation](https://www.zoho.com/people/api/update-records.html)",
  props: {
    app,
    form: {
      propDefinition: [
        app,
        "form",
      ],
    },
    record: {
      propDefinition: [
        app,
        "record",
        (c) => ({
          form: c.form,
        }),
      ],
      reloadProps: true,
    },
  },
  async additionalProps() {
    if (!this.form || !this.record) {
      return;
    }
    const formProps = await this.app.listFieldsOfForm(this.form);
    const recordRes = await this.app.getRecordById(this.form, this.record);
    const props = getAdditionalProps(formProps, true);
    for (const key in props) {
      const [
        record,
      ] = recordRes.response.result;
      if (record[key]) {
        props[key].default = record[`${key}.ID`] ?? record[`${key}.id`] ?? record[`${key}.Id`] ?? record[key];
      }
    }
    return props;
  },
  async run({ $ }) {
    const {
      app,
      form,
      record,
      ...data
    } = this;
    const res = await app.updateRecord(form, record, data);
    $.export("summary", `Record successfully updated with id ${record}`);
    return res;
  },
};
