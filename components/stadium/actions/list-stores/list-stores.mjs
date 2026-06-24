import stadium from "../../stadium.app.mjs";

export default {
  key: "stadium-list-stores",
  name: "List Stores",
  description: "Get all stores for the current user. [See the documentation](https://api.bystadium.com/api/v2/docs#tag/Store-management/operation/getStores)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    stadium,
  },
  async run({ $ }) {
    const response = await this.stadium.listStores({
      $,
    });
    const count = response.stores?.length ?? 0;
    $.export("$summary", `Successfully retrieved ${count} store${count === 1
      ? ""
      : "s"}`);
    return response;
  },
};
