import hansei from "../../hansei.app.mjs";

export default {
  key: "hansei-get-bots",
  name: "Get Bots",
  description: "Retrieves a list of Bots in Hansei. [See the documentation](https://developers.hansei.app/operation/operation-getbots)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    hansei,
  },
  async run({ $ }) {
    const response = await this.hansei.listBots({
      $,
    });
    $.export("$summary", `Successfully retrieved ${response.length} Bot${response.length === 1
      ? ""
      : "s"}`);
    return response;
  },
};
