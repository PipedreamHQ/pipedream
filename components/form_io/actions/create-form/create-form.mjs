import formIo from "../../form_io.app.mjs";
import {
  parseJson, coerceStr, assertEnum,
} from "../../common/utils.mjs";

const FORM_TYPES = [
  "form",
  "resource",
];

export default {
  key: "form_io-create-form",
  name: "Create Form",
  description: "Create a form or resource in Form.io. Use **List Forms** to review existing forms. The `components` prop is a JSON-string array of Form.io component schema objects. [See the documentation](https://apidocs.form.io/#c864243f-1ff5-409b-912f-de5670be9130).",
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
    title: {
      type: "string",
      label: "Title",
      description: "The human-readable title of the form (e.g. `Contact Form`).",
    },
    name: {
      type: "string",
      label: "Name",
      description: "The machine name of the form (e.g. `contactform`).",
    },
    path: {
      type: "string",
      label: "Path",
      description: "The URL path for the form (e.g. `contactform`).",
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
      description: "JSON-string array of Form.io component schema objects. Example: `[{\"type\":\"textfield\",\"key\":\"name\",\"label\":\"Name\",\"input\":true}]`. Parsed with JSON.parse() before sending.",
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
      title,
      name,
      path,
      type,
      components,
      display,
      tags,
      settings,
    } = this;

    const response = await this.formIo.createForm({
      $,
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

    $.export("$summary", `Created form "${response.title}" (${response._id})`);
    return response;
  },
};
