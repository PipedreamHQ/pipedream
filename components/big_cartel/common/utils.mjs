export default {
  async *getResourcesStream({
    resourceFn,
    resourceFnArgs = {},
    resourceKey,
  }) {
    const firstResources = await resourceFn({
      ...resourceFnArgs,
      params: {
        ...resourceFnArgs?.params,
      },
    });
    if (!firstResources[resourceKey]?.length) {
      return;
    }
    for (const resource of firstResources[resourceKey]) {
      yield resource;
    }
    let next = firstResources?.links?.next;
    while (next) {
      const nextResources = await resourceFn({
        ...resourceFnArgs,
        params: {
          ...resourceFnArgs?.params,
        },
        url: next,
      });
      for (const resource of nextResources[resourceKey]) {
        yield resource;
      }
      if (!nextResources[resourceKey]?.length) {
        return;
      }
      next = nextResources?.links?.next;
    }
  },
};
