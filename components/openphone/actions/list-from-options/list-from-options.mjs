// x-pd-ai: optimized
import openphone from "../../openphone.app.mjs";

export default {
  key: "openphone-list-from-options",
  name: "List From Options",
  description: "List your OpenPhone phone numbers as selectable sender options, for use as the `from` value in **Send a Text Message**. Example: call with no inputs → returns a list of `{label, value}` pairs, one per phone number, where `value` is the phone number ID to pass as `from`. [See the documentation](https://www.openphone.com/docs/api-reference/phone-numbers/list-phone-numbers)",
  version: "0.0.2",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    openphone,
  },
  async run({ $ }) {
    const { data } = await this.openphone.listPhoneNumbers({
      $,
    });
    const options = data?.map(({
      id: value, name, formattedNumber,
    }) => ({
      label: name && formattedNumber
        ? `${name} - ${formattedNumber}`
        : value,
      value,
    })) || [];
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
