const PAGE_SIZE = 25;

export default {
  extractProps(that, pairs) {
    const {
      // eslint-disable-next-line no-unused-vars
      app,
      ...props
    } = that;
    for (let key of Object.keys(props)) {
      if (pairs[key]) {
        const keys = pairs[key].split(".");
        keys.reduce((acc, curr, index) => {
          if (index == keys.length - 1)
            acc[curr] = props[key];
          else
            acc[curr] = acc[curr] ?? {};
          return acc[curr];
        }, props);
        delete props[key];
      }
    }
    return props;
  },
  async asyncPropHandler({
    resourceFn, page, labelVal, params,
  } = {}) {
    let resp;
    resp = await resourceFn({
      params: {
        ...params,
        ...(typeof page != "undefined" && {
          offset: page * PAGE_SIZE,
          limit: (page + 1) * PAGE_SIZE,
        }),
      },
    });
    const options = resp.map((item) => ({
      label: typeof labelVal.label == "string" ?
        labelVal.label.split(".").reduce((acc, curr) => acc?.[curr], item) :
        labelVal.label(item),
      value: typeof labelVal.value == "string" ?
        labelVal.value.split(".").reduce((acc, curr) => acc?.[curr], item) :
        labelVal.value(item),
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
    resourceFn, resourceFnArgs, resourceLimit,
  }) {
    let page = 0, resourceCount = 0;
    while (true) {
      const nextResources = await resourceFn({
        ...resourceFnArgs,
        params: {
          ...resourceFnArgs?.params,
          offset: page * PAGE_SIZE,
          limit: ++page * PAGE_SIZE,
        },
      });
      if (!nextResources?.length)
        return;
      for (const resource of nextResources) {
        if (resourceLimit && resourceLimit < ++resourceCount)
          return;
        else
          yield resource;
      }
      if (nextResources?.length < PAGE_SIZE) {
        return;
      }
    }
  },
};
