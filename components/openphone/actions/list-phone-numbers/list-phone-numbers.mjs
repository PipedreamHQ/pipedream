import openphone from "../../openphone.app.mjs";

export default {
  key: "openphone-list-phone-numbers",
  name: "List Phone Numbers",
  description: "Retrieve the list of phone numbers and users associated with your OpenPhone workspace. Example: call with no inputs → returns each phone number's `id`, `number`, `name`, and the users assigned to it. [See the documentation](https://www.openphone.com/docs/mdx/api-reference/phone-numbers/list-phone-numbers)",
  version: "0.0.5",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  ai: "optimized",
  props: {
    openphone,
  },
  async run({ $ }) {
    const { data } = await this.openphone.listPhoneNumbers({
      $,
    });
    if (data?.length) {
      $.export("$summary", `Successfully retrieved ${data.length} phone number${data.length === 1
        ? ""
        : "s"}`);
    }
    return data;
  },
};
