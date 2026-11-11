import heygen from "../../heygen.app.mjs";

export default {
  key: "heygen-list-template-id-options",
  name: "List Template ID Options",
  description: "Retrieves a page of available templates, whose `id` can be used for Template ID fields. If `has_more` is true, pass `next_token` as the Token to get the next page. Example: Limit `2` returns `{\"data\": [{\"id\": \"tpl_1\", \"name\": \"Product launch\", \"aspect_ratio\": \"16:9\"}, {\"id\": \"tpl_2\", \"name\": \"Weekly update\", \"aspect_ratio\": \"9:16\"}], \"has_more\": true, \"next_token\": \"abc\"}`. [See the documentation](https://developers.heygen.com/reference/list-templates)",
  version: "1.0.0",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    heygen,
    limit: {
      propDefinition: [
        heygen,
        "limit",
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
    const response = await this.heygen.listTemplates({
      $,
      params: {
        limit: this.limit,
        token: this.token,
      },
    });
    const count = response.data?.length || 0;
    $.export("$summary", `Successfully retrieved ${count} template${count === 1
      ? ""
      : "s"}`);
    return response;
  },
};
