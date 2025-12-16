import app from "../../eaccounting.app.mjs";

export default {
  key: "eaccounting-get-company-settings",
  name: "Get Company Settings",
  description: "Retrieves company settings. [See the documentation](https://developer.vismaonline.com)",
  version: "0.0.1",
  type: "action",
  props: {
    app,
  },
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  async run({ $ }) {
    const response = await this.app.getCompanySettings({
      $,
    });
    $.export("$summary", "Successfully retrieved company settings");
    return response;
  },
};
