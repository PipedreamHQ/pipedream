import utils from "../../common/utils.mjs";

export default {
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
