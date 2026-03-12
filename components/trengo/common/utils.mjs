export default {
  async *getResourcesStream({
    resourceFn,
    resourceFnArgs,
  }) {
    let page = 1;
    while (true) {
      const nextResources = await resourceFn({
        ...resourceFnArgs,
        params: {
          ...resourceFnArgs?.params,
          page,
        },
      });
      if (!nextResources) {
        throw new Error("No response from the API.");
      }
      const items = Array.isArray(nextResources)
        ? nextResources
        : nextResources.data;
      for (const resource of items) {
        yield resource;
      }
      if (Array.isArray(nextResources) || items.length == 0 || nextResources?.meta?.last_page == page) {
        return;
      }
      page++;
    }
  },
};
