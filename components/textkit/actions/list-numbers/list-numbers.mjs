import textkit from "../../textkit.app.mjs";

export default {
  key: "textkit-list-numbers",
  name: "List Numbers",
  description: "List the active phone numbers on your TextKit account."
    + " Each number includes `phone_number` (E.164), `status`, `mode`, `label`, `tags` and `pools`."
    + " Use it to find a `phone_number` to pass as `from` to **Send SMS** or **Start Verification**."
    + " With a test key, only sandbox numbers are returned."
    + " [See the documentation](https://jointextkit.com/docs/api/numbers/list)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    textkit,
  },
  async run({ $ }) {
    const { data: numbers = [] } = await this.textkit.listNumbers({
      $,
    });
    $.export("$summary", `Found ${numbers.length} number${numbers.length === 1
      ? ""
      : "s"}`);
    return numbers;
  },
};
