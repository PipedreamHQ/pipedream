export default {
  async *getResourcesStream({
    resourceFn,
    resourceFnArgs = {},
    resourceKey,
  }) {
    let page = 1;
    while (true) {
      const nextResources = await resourceFn({
        ...resourceFnArgs,
        params: {
          ...resourceFnArgs.params,
          page,
          per_page: 25,
        },
      });
      if (!nextResources) {
        throw new Error("No response from Sifter API.");
      }
      for (const resource of nextResources[resourceKey]) {
        yield resource;
      }
      if (!nextResources.length) {
        return;
      }
      page++;
    }
  },
};
