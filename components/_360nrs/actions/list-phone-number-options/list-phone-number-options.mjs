import _360nrs from "../../_360nrs.app.mjs";

export default {
  key: "_360nrs-list-phone-number-options",
  name: "List Phone Number Options",
  description: "Retrieves available options for the Phone Number field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    _360nrs,
  },
  async run({ $ }) {
    const options = await _360nrs.propDefinitions.phoneNumber.options.call(this._360nrs);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
