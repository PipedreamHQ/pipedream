import app from "../../kizeo_forms.app.mjs";

export default {
  key: "kizeo_forms-export-form-data-to-csv-or-excel",
  name: "Export Form Data to CSV or Excel",
  description: "Exports data from a form to CSV or Excel format. [See the documentation](https://kizeo.github.io/kizeo-forms-documentations/docs/en/exports)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    formId: {
      propDefinition: [
        app,
        "formId",
      ],
    },
    action: {
      propDefinition: [
        app,
        "action",
      ],
    },
    dataIds: {
      type: "string[]",
      label: "Data IDs",
      description: "The IDs of the data",
      propDefinition: [
        app,
        "dataId",
        ({
          formId, action,
        }) => ({
          formId,
          action,
        }),
      ],
    },
    format: {
      propDefinition: [
        app,
        "exportFormat",
      ],
    },
  },
  methods: {
    exportFormData({
      formId, format, ...args
    } = {}) {
      return this.app.post({
        path: `/forms/${formId}/data/multiple/${format}`,
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      exportFormData,
      formId,
      format,
      dataIds,
    } = this;

    const response = await exportFormData({
      $,
      formId,
      format,
      data: {
        data_ids: dataIds,
      },
    });

    $.export("$summary", `Successfully exported form data to \`${format}\` format`);

    return response;
  },
};
