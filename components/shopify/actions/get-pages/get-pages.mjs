import app from "../../common/rest-admin.mjs";

export default {
  key: "shopify-get-pages",
  name: "Get Pages",
  description: "Retrieve a list of all pages. [See The Documentation](https://shopify.dev/docs/api/admin-rest/2023-04/resources/page#get-pages)",
  version: "0.0.1",
  type: "action",
  props: {
    app,
  },
  async run({ $: step }) {
    const response = await this.app.listPages({
      step,
    });

    step.export("$summary", `Successfully retrieved ${response.pages.length} page(s).`);

    return response;
  },
};
