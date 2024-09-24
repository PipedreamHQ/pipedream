import rasterwise from "../../rasterwise.app.mjs";

export default {
  key: "getscreenshot-capture-element-screenshot",
  name: "Get Account API Usage",
  description:
    "Retrieve your current API usage and available quota. [See the documentation](https://docs.rasterwise.com/docs/getscreenshot/api-reference-1/)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    rasterwise,
    email: {
      type: "string",
      label: "Email Address",
      description: "The email address of this account.",
    },
  },
  async run({ $ }) {
    const {
      rasterwise, ...params
    } = this;
    const response = await rasterwise.getApiUsage({
      $,
      params,
    });
    $.export("$summary", "Successfully retrieved API usage");
    return response;
  },
};
