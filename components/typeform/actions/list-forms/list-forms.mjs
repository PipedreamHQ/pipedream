import typeform from "../../typeform.app.mjs";

export default {
  key: "typeform-list-forms",
  name: "List Forms",
  description: "Retrieves a list of forms. [See the docs here](https://developer.typeform.com/create/reference/retrieve-forms/)",
  type: "action",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    typeform,
    search: {
      propDefinition: [
        typeform,
        "search",
      ],
    },
    page: {
      propDefinition: [
        typeform,
        "page",
      ],
    },
    pageSize: {
      description: "Number of results to retrieve per page. Default is 10. Maximum is 200.",
      default: 10,
      propDefinition: [
        typeform,
        "pageSize",
      ],
    },
    workspaceId: {
      propDefinition: [
        typeform,
        "workspaceId",
      ],
    },
  },
  async run({ $ }) {
    const {
      search,
      page,
      pageSize,
      workspaceId,
    } = this;

    const params = {
      search,
      page,
      page_size: pageSize,
      workspace_id: workspaceId,
    };

    const { items } = await this.typeform.getForms({
      $,
      params,
    });

    // eslint-disable-next-line multiline-ternary
    $.export("$summary", `Successfully retrieved ${items.length} ${items.length == 1 ? "form" : "forms"}`);

    return items;
  },
};
