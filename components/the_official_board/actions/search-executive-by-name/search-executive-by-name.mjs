import app from "../../the_official_board.app.mjs";

export default {
  key: "the_official_board-search-executive-by-name",
  name: "Search Executive",
  description: "Search for executives by name. [See the documentation](https://rest.theofficialboard.com/rest/api/doc/#/Executives/get_executive_search)",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    name: {
      type: "string",
      label: "Name",
      description: "The name of the executive to search for",
    },
  },
  async run({ $ }) {
    const response = await this.app.getExecutiveSearch({
      $,
      params: {
        name: this.name,
      },
    });

    $.export("$summary", `Successfully retrieved ${response.length} executives with name ${this.name}`);
    return response;
  },
};
