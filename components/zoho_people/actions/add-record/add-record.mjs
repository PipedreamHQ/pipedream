import app from "../../zoho_people.app.mjs";
import {
  convertEmptyToNull, getAdditionalProps, normalizeErrorMessage,
} from "../common/add-update-record-common.mjs";

export default {
  type: "action",
  key: "zoho_people-add-record",
  name: "Add Record",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
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
    return getAdditionalProps(formProps);
  },
  async run({ $ }) {
    const {
      app,
      form,
      ...data
    } = this;
    const res = await app.insertRecord(form, convertEmptyToNull(data));
    if (res.response.errors) {
      throw new Error(`Zoho People error response: ${normalizeErrorMessage(res.response.errors)}`);
    }
    $.export("summary", `Record successfully created with id ${res.response.result.pkId}`);
    return res;
  },
};
