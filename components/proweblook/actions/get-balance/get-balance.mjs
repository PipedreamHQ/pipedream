import app from "../../proweblook.app.mjs";

export default {
  key: "proweblook-get-balance",
  name: "Get Balance",
  description: "Retrieve the connected ProWebLook account email and remaining credit balances for email verification, phone validation, and WhatsApp checks."
    + " This operation is free and consumes zero credits."
    + " Returns `data.account_email` along with `data.email`, `data.phone`, and `data.whatsapp` credit pool objects (`amount` and `unlimited`)."
    + " Use before batch runs of **Verify Email**, **Validate Phone**, or **Check WhatsApp**."
    + " [See the documentation](https://proweblook.com/openapi.json)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
  },
  async run({ $ }) {
    const response = await this.app.getBalance({
      $,
      data: {},
    });

    const accountEmail = response?.data?.account_email || "connected account";
    $.export("$summary", `Retrieved ProWebLook credit balance for ${accountEmail}`);
    return response;
  },
};
