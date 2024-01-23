import fireberry from "../../fireberry.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "fireberry-list-articles",
  name: "List Articles",
  description: "List all articles from Fireberry. [See the documentation](https://developers.fireberry.com/reference/get-all-articles)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    fireberry,
    pageSize: {
      propDefinition: [
        fireberry,
        "pageSize",
      ],
    },
    pageNumber: {
      propDefinition: [
        fireberry,
        "pageNumber",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.fireberry.getAllArticles({
      pageSize: this.pageSize,
      pageNumber: this.pageNumber,
    });

    $.export("$summary", `Successfully listed ${response.length} articles`);
    return response;
  },
};
