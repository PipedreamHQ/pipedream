import zerotier from "../../zerotier.app.mjs";

export default {
  key: "zerotier-get-status",
  type: "action",
  version: "0.0.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  name: "Get Account Status",
  description: "Get the overall account status. Returns the overall status of the account tied to the API token in use. [See docs here](https://docs.zerotier.com/central/v1/#operation/getStatus)",
  props: {
    zerotier,
  },
  async run({ $ }) {
    const response = await this.zerotier.getStatus({
      $,
    });

    $.export("$summary", "Successfully retrieved account status");

    return response;
  },
};
