import app from "../../kizeo_forms.app.mjs";

export default {
  key: "kizeo_forms-export-to-pdf",
  name: "Export to PDF",
  description: "Exports data from a chosen export (Word or Excel) to PDF format. [See the documentation](https://kizeo.github.io/kizeo-forms-documentations/docs/en/restv3)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
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
    exportId: {
      propDefinition: [
        app,
        "exportId",
        ({ formId }) => ({
          formId,
        }),
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
  },
  methods: {
    exportDataToPdf({
      formId, exportId, ...args
    }) {
      return this.app.post({
        path: `/forms/${formId}/multiple_data/exports/${exportId}/pdf`,
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      exportDataToPdf,
      formId,
      exportId,
      dataIds,
    } = this;

    const response = await exportDataToPdf({
      formId,
      exportId,
      data: {
        data_ids: dataIds,
      },
    });

    $.export("$summary", "Successfully exported data to PDF");

    return response;
  },
};
