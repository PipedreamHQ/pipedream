import app from "../../signnow.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "signnow-prefill-text-fields",
  name: "Prefill Text Fields",
  description: "Adds values to fields that the signers can later edit when they receive the document for signature. [See the documentation](https://docs.signnow.com/docs/signnow/document/operations/update-a-v-2-document-prefill-text)",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    documentId: {
      propDefinition: [
        app,
        "documentId",
      ],
    },
    numberOfFields: {
      type: "integer",
      label: "Number Of Fields",
      description: "The number of fields to generate. Defaults to 1.",
      default: 1,
      reloadProps: true,
    },
  },
  methods: {
    fieldsPropsMapper(prefix) {
      const {
        [`${prefix}FieldName`]: fieldName,
        [`${prefix}PrefilledText`]: prefilledText,
      } = this;

      return {
        field_name: fieldName,
        prefilled_text: prefilledText,
      };
    },
    getFieldsPropDefinitions({
      prefix, label,
    } = {}) {
      return {
        [`${prefix}FieldName`]: {
          type: "string",
          label: `${label} - Field Name`,
          description: "Name of the field",
        },
        [`${prefix}PrefilledText`]: {
          type: "string",
          label: `${label} - Prefilled Text`,
          description: "Text to prefill in the field",
        },
      };
    },
    prefillTextFields({
      documentId, ...args
    } = {}) {
      return this.app.put({
        path: `/v2/documents/${documentId}/prefill-texts`,
        ...args,
      });
    },
  },
  additionalProps() {
    const {
      numberOfFields,
      getFieldsPropDefinitions,
    } = this;

    return utils.getAdditionalProps({
      numberOfFields,
      fieldName: "field",
      getPropDefinitions: getFieldsPropDefinitions,
    });
  },
  async run({ $ }) {
    const {
      prefillTextFields,
      documentId,
      numberOfFields,
      fieldsPropsMapper,
    } = this;

    const response = await prefillTextFields({
      $,
      documentId,
      data: {
        fields: utils.getFieldsProps({
          numberOfFields,
          fieldName: "field",
          propsMapper: fieldsPropsMapper,
        }),
      },
    });

    $.export("$summary", "Successfully pre-filled text fields in the document");
    return response;
  },
};
