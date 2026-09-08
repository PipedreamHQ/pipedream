import formIo from "../../form_io.app.mjs";
import {
  parseJson, coerceStr, assertEnum,
} from "../../common/utils.mjs";

const FORM_TYPES = [
  "form",
  "resource",
];

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
      type: "string",
      label: "Title",
      description: "Updated title of the form.",
      optional: true,
    },
    name: {
      type: "string",
      label: "Name",
      description: "Updated machine name of the form.",
      optional: true,
    },
    path: {
      type: "string",
      label: "Path",
      description: "Updated URL path for the form.",
      optional: true,
    },
    type: {
      type: "string",
      label: "Type",
      description: "The form type. One of `form` or `resource`.",
      optional: true,
      options: [
        "form",
        "resource",
      ],
    },
    components: {
      type: "string",
      label: "Components",
      description: "JSON-string array of Form.io component schema objects. Example: `[{\"type\":\"textfield\",\"key\":\"name\",\"label\":\"Full Name\",\"input\":true}]`. Parsed from a JSON string before sending.",
      optional: true,
    },
    display: {
      type: "string",
      label: "Display",
      description: "How the form is displayed (e.g. `form`, `wizard`, `pdf`).",
      optional: true,
    },
    tags: {
      type: "string[]",
      label: "Tags",
      description: "Tags to associate with the form.",
      optional: true,
    },
    settings: {
      type: "string",
      label: "Settings",
      description: "JSON-string object of form settings. Example: `{\"theme\":\"default\"}`.",
      optional: true,
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
        title: coerceStr(title),
        name: coerceStr(name),
        path: coerceStr(path),
        type: assertEnum(type, "type", FORM_TYPES),
        components: parseJson(components, "components", "array"),
        display: coerceStr(display),
        tags,
        settings: parseJson(settings, "settings", "object"),
      },
    });

    $.export("$summary", `Updated form "${response.title}" (${response._id})`);
    return response;
  },
};
