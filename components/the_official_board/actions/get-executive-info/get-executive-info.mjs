import app from "../../the_official_board.app.mjs";

export default {
  key: "the_official_board-get-executive-info",
  name: "Get Executive Info",
  description: "Get executive biography information. [See the documentation](https://rest.theofficialboard.com/rest/api/doc/#/Executives/get_executive_biography)",
  version: "0.0.2",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    executiveId: {
      propDefinition: [
        app,
        "executiveId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.getExecutiveBiography({
      $,
      params: {
        bioID: this.executiveId,
      },
    });

    $.export("$summary", `Successfully retrieved executive information for executive with ID ${this.executiveId}`);
    return response;
  },
};
