import formIo from "../../form_io.app.mjs";
import { parseJson } from "../../common/utils.mjs";

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
      propDefinition: [
        formIo,
        "title",
      ],
      description: "The human-readable title of the form (e.g. `Contact Form`).",
    },
    name: {
      propDefinition: [
        formIo,
        "name",
      ],
      description: "The machine name of the form (e.g. `contactform`).",
    },
    path: {
      propDefinition: [
        formIo,
        "path",
      ],
      description: "The URL path for the form (e.g. `contactform`).",
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
      description: "JSON-string array of Form.io component schema objects. Example: `[{\"type\":\"textfield\",\"key\":\"name\",\"label\":\"Name\",\"input\":true}]`. Parsed with JSON.parse() before sending.",
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

    $.export("$summary", `Created form "${response.title}" (${response._id})`);
    return response;
  },
};
