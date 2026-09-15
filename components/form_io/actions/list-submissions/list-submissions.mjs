import formIo from "../../form_io.app.mjs";
import { pluckFields } from "../../common/utils.mjs";

export default {
  key: "form_io-list-submissions",
  name: "List Submissions",
  description: "List submissions for a Form.io form. Optionally filter by state. Use **List Forms** to find the form ID. Form.io returns up to `limit` records (default 10); if you receive a full page there may be more — raise `limit` (up to 1000) or page with `skip` to retrieve them all. Pass `fields` to return only the fields you need (e.g. `_id`, `data`, `created`). [See the documentation](https://apidocs.form.io/#1f207caa-9d04-3e81-2973-e4bf82ee5190).",
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
    formId: {
      propDefinition: [
        formIo,
        "formId",
      ],
    },
    state: {
      propDefinition: [
        formIo,
        "state",
      ],
      description: "Filter by submission state. One of `submitted` or `draft`.",
    },
    sort: {
      propDefinition: [
        formIo,
        "sort",
      ],
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
    fields: {
      propDefinition: [
        formIo,
        "fields",
      ],
      description: "Optional. Return only these top-level fields from each submission (e.g. `_id`, `data`, `created`, `state`). Omit to return the full submission objects, which include access and metadata envelopes.",
    },
  },
  async run({ $ }) {
    const {
      formId,
      state,
      sort,
      limit,
      skip,
      fields,
    } = this;

    const response = await this.formIo.listSubmissions({
      $,
      formId,
      params: {
        state,
        sort,
        limit,
        skip,
      },
    });

    const submissions = Array.isArray(response)
      ? response
      : response?.data ?? [];

    $.export("$summary", `Retrieved ${submissions.length} submission(s)`);
    return fields?.length
      ? pluckFields(submissions, fields)
      : response;
  },
};
