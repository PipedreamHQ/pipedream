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
      for (const resource of nextResources.data) {
        yield resource;
      }
      if (nextResources.data.length == 0 || nextResources?.meta?.last_page == page) {
        return;
      }
      page++;
    }
  },
};
