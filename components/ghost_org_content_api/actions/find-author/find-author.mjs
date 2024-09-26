import ghostContentApi from "../../ghost_org_content_api.app.mjs";
import constants from "../../common/constants.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "ghost_org_content_api-find-author",
  name: "Find author",
  description: "Find an author. [See the documentation](https://ghost.org/docs/content-api/#authors).",
  type: "action",
  version: "0.0.2",
  props: {
    ghostContentApi,
    name: {
      type: "string",
      label: "Author's Name",
      description: "The name of an author",
    },
  },
  async run({ $ }) {
    const stream = await this.ghostContentApi.getResourcesStream({
      resourceFn: this.ghostContentApi.getAuthors,
      resourceFnArgs: {
        $,
        params: {
          limit: constants.DEFAULT_LIMIT,
        },
      },
      resourceName: "authors",
    });

    const resources = await utils.streamIterator(stream);
    const authors =
      resources.filter(({ name }) =>
        name.toLowerCase().includes(this.name?.toLowerCase()));

    $.export("$summary", `Successfuly found ${authors.length} author(s)`);

    return authors;
  },
};
