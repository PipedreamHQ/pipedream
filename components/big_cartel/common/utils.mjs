export default {
  async *getResourcesStream({
    resourceFn,
    resourceFnArgs = {},
    resourceKey,
  }) {
    let next;
    while (true) {
      const nextResources = await resourceFn({
        ...resourceFnArgs,
        params: {
          ...resourceFnArgs?.params,
        },
        ...( next && {
          url: next,
        }),
      });
      for (const resource of nextResources[resourceKey]) {
        yield resource;
      }
      if (!nextResources[resourceKey]?.length) {
        return;
      }
      next = nextResources?.links?.next;
      if (!next)
        return;
    }
  },
};
