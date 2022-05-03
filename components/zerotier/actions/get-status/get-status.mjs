import zerotier from "../../zerotier.app.mjs";

export default {
  key: "zerotier-get-status",
  type: "action",
  version: "0.0.1",
  name: "Get Account Status",
  description: "Get the overall account status. Returns the overall status of the account tied to the API token in use.",
  props: {
    zerotier,
  },
  async run({ $ }) {
    const response = await this.zerotier.getStatus({
      $,
    });

    $.export("summary", "Sucessfully retrieved account status");

    return response;
  },
};
