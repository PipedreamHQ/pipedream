import surecart from "../../surecart.app.mjs";

export default {
  key: "surecart-list-media",
  name: "List Media",
  description: "Return a list of media items. [See the documentation](https://developer.surecart.com/api-reference/medias/list)",
  version: "0.0.2",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    surecart,
    ids: {
      propDefinition: [
        surecart,
        "ids",
      ],
    },
    limit: {
      propDefinition: [
        surecart,
        "limit",
      ],
    },
    page: {
      propDefinition: [
        surecart,
        "page",
      ],
    },
    publicAccess: {
      type: "boolean",
      label: "Public Access",
      description: "Filter by access setting. Set to `true` to return only publicly accessible media, or `false` for private media.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.surecart.listMedia({
      $,
      params: {
        "ids[]": this.ids,
        "limit": this.limit,
        "page": this.page,
        "public_access": this.publicAccess,
      },
    });
    $.export("$summary", `Successfully retrieved ${response.data?.length ?? 0} media item(s)`);
    return response;
  },
};
