import openphone from "../../openphone.app.mjs";

export default {
  key: "openphone-list-phone-numbers",
  name: "List Phone Numbers",
  description: "Retrieve the list of phone numbers and users associated with your OpenPhone workspace. [See the documentation](https://www.openphone.com/docs/mdx/api-reference/phone-numbers/list-phone-numbers)",
  version: "0.0.1",
  type: "action",
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
