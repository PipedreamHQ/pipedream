import hansei from "../../hansei.app.mjs";

export default {
  key: "hansei-get-collections",
  name: "Get Collections",
  description: "Retrieves a list of Collections in Hansei. [See the documentation](https://developers.hansei.app/operation/operation-getcollections)",
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
    const response = await this.hansei.listCollections({
      $,
    });
    $.export("$summary", `Successfully retrieved ${response.length} Collection${response.length === 1
      ? ""
      : "s"}`);
    return response;
  },
};
