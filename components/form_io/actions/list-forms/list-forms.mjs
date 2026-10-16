import formIo from "../../form_io.app.mjs";
import { pluckFields } from "../../common/utils.mjs";

export default {
  key: "form_io-list-forms",
  name: "List Forms",
  description: "List forms and resources in the Form.io project. Optionally filter by `type` to return only forms or only resources. Form.io returns up to `limit` records (default 10); if you receive a full page there may be more — raise `limit` (up to 1000) or page with `skip` to retrieve them all. Forms are large; pass `fields` to return only the fields you need (e.g. `_id`, `title`, `name`, `path`). [See the documentation](https://apidocs.form.io/#40baaaa1-c309-4f81-a546-6821cec14701).",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    formIo,
    type: {
      propDefinition: [
        formIo,
        "type",
      ],
      description: "Filter by form type. One of `form` or `resource`. Omit to return both.",
    },
    limit: {
      propDefinition: [
        formIo,
        "limit",
      ],
    },
    skip: {
      propDefinition: [
        formIo,
        "skip",
      ],
    },
    sort: {
      propDefinition: [
        formIo,
        "sort",
      ],
    },
    fields: {
      propDefinition: [
        formIo,
        "fields",
      ],
      description: "Optional. Return only these top-level fields from each form (e.g. `_id`, `title`, `name`, `path`, `type`). Omit to return the full form objects, which include the large `components` and `access` arrays.",
    },
  },
  async run({ $ }) {
    const {
      type,
      limit,
      skip,
      sort,
      fields,
    } = this;

    const response = await this.formIo.listForms({
      $,
      params: {
        type,
        limit,
        skip,
        sort,
      },
    });

    const forms = Array.isArray(response)
      ? response
      : response?.data ?? [];

    $.export("$summary", `Retrieved ${forms.length} form(s)`);
    return fields?.length
      ? pluckFields(forms, fields)
      : response;
  },
};
