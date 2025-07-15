import chattermill from "../../chattermill.app.mjs";

export default {
  key: "chattermill-search-responses",
  name: "Search Responses",
  description: "Search for responses. [See the documentation](https://apidocs.chattermill.com/#3e586e66-678f-0167-ec06-af9e1b715ef5)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    chattermill,
    projectId: {
      propDefinition: [
        chattermill,
        "projectId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.chattermill.searchResponses({
      $,
      data: {},
    });
    $.export("$summary", "Successfully searched for responses.");
    return response;
  },
};
