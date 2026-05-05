import returnista from "../../returnista.app.mjs";

export default {
  key: "returnista-get-return-reasons",
  name: "Get Return Reasons",
  description: "Gets a list of return reasons for the given account. [See the documentation](https://platform.returnista.com/reference/rest-api/#get-/return-reasons)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    returnista,
  },
  async run({ $ }) {
    const { data: response } = await this.returnista.getReturnReasons({
      $,
    });
    $.export("$summary", `Successfully retrieved ${response.length} return reason(s)`);
    return response;
  },
};
