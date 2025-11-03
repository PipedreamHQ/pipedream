import commpeak from "../../commpeak.app.mjs";

export default {
  key: "commpeak-get-account-info",
  name: "Get Account Info",
  description: "Get account information such as balance and tariffs. [See the documentation](https://lookup.api-docs.commpeak.com/?_gl=1*50xs02*_gcl_au*MTMxMzgzMzA3Ny4xNjk3NTY0NDE3#84b40f09-cf1e-4729-a556-4da44c6f6ade)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    commpeak,
  },
  async run({ $ }) {
    const response = await this.commpeak.getAccountInfo({
      $,
    });
    $.export("$summary", "Successfully obtained account info");
    return response;
  },
};
