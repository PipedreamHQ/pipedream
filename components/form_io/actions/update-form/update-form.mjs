import formIo from "../../form_io.app.mjs";
import { parseJson } from "../../common/utils.mjs";

export default {
  key: "form_io-update-form",
  name: "Update Form",
  description: "Update a form or resource in Form.io. Only the fields you provide are changed; omitted fields keep their current values. Use **List Forms** to find the form ID. The `components` prop is a JSON-string array of Form.io component schema objects. [See the documentation](https://apidocs.form.io/#9faa123a-3183-4513-9ae5-c64553359749).",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    formIo,
    formId: {
      propDefinition: [
        formIo,
        "formId",
      ],
    },
    title: {
      propDefinition: [
        formIo,
        "title",
      ],
      description: "Updated title of the form.",
      optional: true,
    },
    name: {
      propDefinition: [
        formIo,
        "name",
      ],
      description: "Updated machine name of the form.",
      optional: true,
    },
    path: {
      propDefinition: [
        formIo,
        "path",
      ],
      description: "Updated URL path for the form.",
      optional: true,
    },
    type: {
      propDefinition: [
        formIo,
        "type",
      ],
    },
    components: {
      propDefinition: [
        formIo,
        "components",
      ],
      description: "JSON-string array of Form.io component schema objects. Example: `[{\"type\":\"textfield\",\"key\":\"name\",\"label\":\"Full Name\",\"input\":true}]`. Parsed from a JSON string before sending.",
      optional: true,
    },
    display: {
      propDefinition: [
        formIo,
        "display",
      ],
    },
    tags: {
      propDefinition: [
        formIo,
        "tags",
      ],
    },
    settings: {
      propDefinition: [
        formIo,
        "settings",
      ],
      description: "JSON-string object of form settings. Example: `{\"theme\":\"default\"}`.",
    },
  },
  async run({ $ }) {
    const {
      formId,
      title,
      name,
      path,
      type,
      components,
      display,
      tags,
      settings,
    } = this;

    const response = await this.formIo.updateForm({
      $,
      formId,
      data: {
        title,
        name,
        path,
        type,
        components: parseJson(components, "components", "array"),
        display,
        tags,
        settings: parseJson(settings, "settings", "object"),
      },
    });

    $.export("$summary", `Updated form "${response.title}" (${response._id})`);
    return response;
  },
};
