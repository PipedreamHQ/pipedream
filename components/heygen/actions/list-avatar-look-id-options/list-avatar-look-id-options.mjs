import heygen from "../../heygen.app.mjs";

export default {
  key: "heygen-list-avatar-look-id-options",
  name: "List Avatar Look ID Options",
  description: "Retrieves a page of available photo avatar looks, whose `id` can be used for Avatar Look ID fields. Pass **Fields** to keep the response small. If `has_more` is true, pass `next_token` as the Token to get the next page. Example: Limit `2` and Fields `[\"id\", \"name\"]` returns `{\"data\": [{\"id\": \"look_1\", \"name\": \"Office look\"}, {\"id\": \"look_2\", \"name\": \"Outdoor look\"}], \"has_more\": true, \"next_token\": \"abc\"}`. [See the documentation](https://developers.heygen.com/reference/list-avatar-looks)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    heygen,
    avatarLookFields: {
      propDefinition: [
        heygen,
        "avatarLookFields",
      ],
    },
    limit: {
      propDefinition: [
        heygen,
        "avatarLookLimit",
      ],
    },
    token: {
      propDefinition: [
        heygen,
        "token",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.heygen.listAvatarLooks({
      $,
      params: {
        avatar_type: "photo_avatar",
        limit: this.limit,
        token: this.token,
      },
    });
    const data = this.heygen.pluckFields(response.data, this.avatarLookFields);
    $.export("$summary", `Successfully retrieved ${data.length} avatar look${data.length === 1
      ? ""
      : "s"}`);
    return {
      ...response,
      data,
    };
  },
};
