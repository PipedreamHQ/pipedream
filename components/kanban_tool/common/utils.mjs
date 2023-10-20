const PAGE_SIZE = 25;

export default {
  async asyncPropHandler({
    resourceFn, resourceKey, page, labelVal, params,
  } = {}) {
    let resp = await resourceFn({
      ...params,
      params: {
        ...params?.params,
        ...(typeof page != "undefined" && {
          page,
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
    resourceFn, resourceFnArgs, resourceLimit, resourceKey, pagingCfg,
  }) {
    let pageVal = pagingCfg?.pageVal ?? 0, resourceCount = 0;
    while (true) {
      const nextResources = await resourceFn({
        ...resourceFnArgs,
        params: {
          ...resourceFnArgs?.params,
          ...(!pagingCfg?.noPaging && {
            limit: PAGE_SIZE,
            [pagingCfg?.pageKey ?? "page"]: pageVal,
          }),
        },
      });
      const resources = resourceKey
        ? resourceKey.split(".").reduce((acc, curr) => acc?.[curr], nextResources)
        : nextResources;
      if (!resources?.length)
        return;
      pageVal = pagingCfg?.newVal?.(resources) ?? pageVal + 1;
      for (const resource of resources) {
        if (resourceLimit && resourceLimit < ++resourceCount) {
          return;
        } else {
          yield resource;
        }
      }
      if (resources?.length < PAGE_SIZE || pagingCfg?.noPaging) {
        return;
      }
    }
  },
};
