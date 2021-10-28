import typeform from "../../typeform.app.mjs";
import common from "../common.mjs";

export default {
  ...common,
  key: "typeform-list-forms",
  name: "List Forms",
  description: "Retrieves a list of forms. [See the docs here](https://developer.typeform.com/create/reference/retrieve-forms/)",
  type: "action",
  version: "0.0.1",
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
      type: "string",
      label: "Workspace ID",
      description: "Retrieve typeforms for the specified workspace.",
      optional: true,
      async options({ page }) {
        const { items } = await this.typeform.getWorkspaces({
          params: {
            page_size: 10,
            page: page + 1, // pipedream page 0-indexed, github is 1
          },
        });

        return items.map(({
          name, id,
        }) => ({
          label: name,
          value: id,
        }));
      },
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
    $.export("$summary", `🎉 Successfully listed ${items.length} ${items.length == 1 ? `form` : `forms`}`)
    
    return items;
  },
};
