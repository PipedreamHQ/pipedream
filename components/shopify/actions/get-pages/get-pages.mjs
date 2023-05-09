import app from "../../common/rest-admin.mjs";
import utils from "../../common/utils.mjs";

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
    const stream = this.app.getResourcesStream({
      resourceFn: this.app.listPages,
      resourceFnArgs: {
        step,
      },
      resourceName: "pages",
    });

    const pages = await utils.streamIterator(stream);

    step.export("$summary", `Successfully retrieved ${pages.length} page(s).`);

    return pages;
  },
};
