import typeform from "../../typeform.app.mjs";
import common from "../common.mjs";

export default {
  key: "typeform-list-forms",
  name: "List Forms",
  description: "Retrieves a list of forms. [See the docs here](https://developer.typeform.com/create/reference/retrieve-forms/)",
  type: "action",
  version: "0.0.1",
  methods: common.methods,
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
        try {
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

        } catch (error) {
          throw new Error(error);
        }
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

    try {
      const { items } = await this.typeform.getForms({
        $,
        params,
      });

      return items;

    } catch (error) {
      throw new Error(error);
    }
  },
};
