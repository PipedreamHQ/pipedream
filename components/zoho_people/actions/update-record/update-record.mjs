import app from "../../zoho_people.app.mjs";
import {
  convertEmptyToNull, getAdditionalProps, normalizeErrorMessage,
} from "../common/add-update-record-common.mjs";

export default {
  type: "action",
  key: "zoho_people-update-record",
  name: "Update Record",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
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
    if (!this.form) {
      return;
    }
    const formProps = await this.app.listFieldsOfForm(this.form);
    return getAdditionalProps(formProps, true);
  },
  async run({ $ }) {
    const {
      app,
      form,
      record,
      ...data
    } = this;
    const res = await app.updateRecord(form, record, convertEmptyToNull(data));
    if (res.response.errors) {
      throw new Error(`Zoho People error response: ${normalizeErrorMessage(res.response.errors)}`);
    }
    $.export("summary", `Record successfully updated with id ${record}`);
    return res;
  },
};
