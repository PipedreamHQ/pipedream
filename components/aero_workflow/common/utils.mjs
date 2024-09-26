export default {
  extractProps(that, pairs) {
    const {
      // eslint-disable-next-line no-unused-vars
      app,
      ...props
    } = that;
    for (let key of Object.keys(props)) {
      if (pairs && pairs[key]) {
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
    resourceFn, labelVal, params, resourceKey,
  } = {}) {
    const resp = await resourceFn({
      params: {
        ...params,
      },
    });
    const label = labelVal?.label ?? "name";
    const value = labelVal?.value ?? "id";
    const items = resourceKey.split(".").reduce((acc, curr) => acc?.[curr], resp);
    return items.map((item) => ({
      label: typeof label == "string" ?
        label.split(".").reduce((acc, curr) => acc?.[curr], item) :
        label(item),
      value: typeof value == "string" ?
        value.split(".").reduce((acc, curr) => acc?.[curr], item) :
        value(item),
    }));
  },
};
