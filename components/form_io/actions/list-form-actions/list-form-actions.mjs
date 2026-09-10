import formIo from "../../form_io.app.mjs";

export default {
  key: "form_io-list-form-actions",
  name: "List Form Actions",
  description: "List all actions attached to a Form.io form. Use **List Forms** to find the form ID. Form.io returns up to `limit` records (default 10); if you receive a full page there may be more — raise `limit` (up to 1000) or page with `skip` to retrieve them all. [See the documentation](https://apidocs.form.io/#3f2531ad-bd2e-4e8e-889f-1bce44ce9651).",
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
  },
  async run({ $ }) {
    const {
      formId,
      limit,
      skip,
      sort,
    } = this;

    const response = await this.formIo.listFormActions({
      $,
      formId,
      params: {
        limit,
        skip,
        sort,
      },
    });

    const actions = Array.isArray(response)
      ? response
      : response?.data ?? [];

    $.export("$summary", `Retrieved ${actions.length} form action(s)`);
    return response;
  },
};
