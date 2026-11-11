import formIo from "../../form_io.app.mjs";

export default {
  key: "form_io-list-roles",
  name: "List Roles",
  description: "List all roles in the Form.io project, including the built-in Administrator, Authenticated, and Anonymous roles. Form.io returns up to `limit` records (default 10); if you receive a full page there may be more — raise `limit` (up to 1000) or page with `skip` to retrieve them all. [See the documentation](https://apidocs.form.io/#8ecd0673-9088-4157-ae0d-161f93d090fb).",
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
      limit,
      skip,
      sort,
    } = this;

    const response = await this.formIo.listRoles({
      $,
      params: {
        limit,
        skip,
        sort,
      },
    });

    const roles = Array.isArray(response)
      ? response
      : response?.data ?? [];

    $.export("$summary", `Retrieved ${roles.length} role(s)`);
    return response;
  },
};
