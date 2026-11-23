import app from "../../tinko.app.mjs";

export default {
  key: "tinko-list-custom-fields",
  name: "List Custom Fields",
  description: "List the contact custom fields configured in Tinko, with their name, type and options."
    + " Use the `name` of each field as a key in the **Custom Fields** of **Create Contact** or **Update Contact**."
    + " [See the documentation](https://docs.tinko.com.br/endpoints/contacts/#listar-campos-personalizados)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    activeOnly: {
      type: "boolean",
      label: "Active Only",
      description: "Whether to return only active custom fields, e.g. `true`. Defaults to `true`.",
      default: true,
      optional: true,
    },
    maxResults: {
      propDefinition: [
        app,
        "maxResults",
      ],
    },
  },
  async run({ $ }) {
    const fields = await this.app.getPaginatedResults({
      fn: this.app.listCustomFields,
      args: {
        $,
        params: {
          is_active: this.activeOnly === false
            ? undefined
            : true,
        },
      },
      max: this.maxResults,
    });

    $.export("$summary", `Found ${fields.length} custom field${fields.length === 1
      ? ""
      : "s"}`);
    return fields;
  },
};
