import qs from "qs";
import {
  configField,
  emptyStrToUndefined, prepareFields,
} from "../../common/utils.mjs";
import wufoo from "../../wufoo.app.mjs";

export default {
  key: "wufoo-submit-form-entry",
  name: "Submit Form Entry",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  description: "Submit a new entry to a specific form. [See the documentation](https://wufoo.github.io/docs/#submit-entry)",
  type: "action",
  props: {
    wufoo,
    formHash: {
      propDefinition: [
        wufoo,
        "formHash",
      ],
      reloadProps: true,
    },
  },
  async additionalProps() {
    if (!this.formHash) {
      return {};
    }
    const { Fields: fields } = await this.wufoo.listFields(this.formHash);
    return prepareFields(fields);
  },
  methods: {
    async getFieldValues() {
      const { Fields: fields } = await this.wufoo.listFields(this.formHash);
      return Object.entries(this)
        .reduce((reduction, [
          key,
          fieldValue,
        ]) => {
          const [
            , fieldId,
          ] = key.split("fieldValue");
          const customFieldId = emptyStrToUndefined(fieldId);
          const customFieldValue = emptyStrToUndefined(fieldValue);
          if (customFieldId && customFieldValue) {
            return {
              ...reduction,
              ...configField(customFieldId, customFieldValue, fields),
            };
          }
          return reduction;
        }, {});
    },
  },
  async run({ $ }) {
    const {
      wufoo,
      formHash,
    } = this;

    const response = await wufoo.submitFormEntry({
      $,
      formHash,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      data: qs.stringify(await this.getFieldValues()),
    });

    $.export("$summary", `A new form entry with Id: ${response.EntryId} was successfully submited!`);
    return response;
  },
};
