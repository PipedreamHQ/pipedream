import zenscrape from "../../zenscrape.app.mjs";

export default {
  key: "zenscrape-get-credit-status",
  name: "Get Credit Status",
  description: "Retrieve the number of remaining credits in Zenscrape. [See the documentation](https://app.zenscrape.com/documentation)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    zenscrape,
  },
  async run({ $ }) {
    const response = await this.zenscrape.getStatus({
      $,
    });
    $.export("$summary", "Successfully retrieved credit status.");
    return response;
  },
};
