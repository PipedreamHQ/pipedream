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
        },
      });
      if (!nextResources) {
        throw new Error("No response from Status Hero API.");
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
