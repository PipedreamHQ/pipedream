const PAGE_SIZE = 50;

export default {
  async asyncPropHandler({
    resourceFn, resourceKey, page, labelVal, params,
  } = {}) {
    let resp = await resourceFn({
      ...params,
      params: {
        ...params?.params,
        ...(typeof page != "undefined" && {
          offset: page * PAGE_SIZE,
          limit: PAGE_SIZE,
        }),
      },
    });
    const items = resourceKey.split(".").reduce((acc, curr) => acc?.[curr], resp);
    const label = labelVal?.label ?? "name";
    const value = labelVal?.value ?? "id";
    const options = items.map((item) => ({
      label: typeof label == "string" ?
        label.split(".").reduce((acc, curr) => acc?.[curr], item) :
        label(item),
      value: typeof value == "string" ?
        value.split(".").reduce((acc, curr) => acc?.[curr], item) :
        value(item),
    }));
    return typeof page != "undefined"
      ? {
        options,
        context: {
          page: page + 1,
        },
      } :
      options;
  },
  async *getResourcesStream({
    resourceFn, resourceFnArgs, resourceLimit, resourceKey, offset,
  }) {
    let page = 0, resourceCount = 0, startOffset = offset ?? 0;
    while (true) {
      const nextResources = await resourceFn({
        ...resourceFnArgs,
        params: {
          ...resourceFnArgs?.params,
          limit: PAGE_SIZE,
          offset: startOffset + PAGE_SIZE * page++,
        },
      });
      const resources = resourceKey
        ? resourceKey.split(".").reduce((acc, curr) => acc?.[curr], nextResources)
        : nextResources;
      if (!resources?.length)
        return;
      for (const resource of resources) {
        if (resourceLimit && resourceLimit < ++resourceCount) {
          return;
        } else {
          yield resource;
        }
      }
      if (resources?.length < PAGE_SIZE) {
        return;
      }
    }
  },
};
