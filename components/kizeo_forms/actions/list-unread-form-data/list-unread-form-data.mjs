import app from "../../kizeo_forms.app.mjs";

export default {
  key: "kizeo_forms-list-unread-form-data",
  name: "List Unread Form Data",
  description: "Retrieves a list of unread form entries/data from Kizeo Forms. [See the documentation](https://kizeo.github.io/kizeo-forms-documentations/docs/en/restv3)",
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
    format: {
      propDefinition: [
        app,
        "format",
      ],
    },
  },
  async run({ $ }) {
    const {
      app,
      formId,
      action,
      format,
    } = this;

    const response = await app.listUnreadFormData({
      $,
      formId,
      action,
      params: {
        format,
      },
    });

    $.export("$summary", `Successfully listed ${response?.data.length} unread form data entries`);

    return response;
  },
};
