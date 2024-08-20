import klaviyo from "../../klaviyo.app.mjs";

export default {
  key: "klaviyo-get-lists",
  name: "Get Lists",
  description: "Get a listing of all of the lists in an account. [See the docs here](https://developers.klaviyo.com/en/v1-2/reference/get-lists)",
  version: "0.0.3",
  type: "action",
  props: {
    klaviyo,
  },
  async run({ $ }) {
    const response = await this.klaviyo.getLists();

    $.export("$summary", "List Successfully fetched!");
    return response.body;
  },
};
