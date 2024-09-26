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
    resourceFn, labelVal, params, resourceKey,
  } = {}) {
    let resp;
    resp = await resourceFn({
      params: {
        ...params,
      },
    });
    const items = resourceKey.split(".").reduce((acc, curr) => acc?.[curr], resp);
    return items.map((item) => ({
      label: typeof labelVal.label == "string" ?
        labelVal.label.split(".").reduce((acc, curr) => acc?.[curr], item) :
        labelVal.label(item),
      value: typeof labelVal.value == "string" ?
        labelVal.value.split(".").reduce((acc, curr) => acc?.[curr], item) :
        labelVal.value(item),
    }));
  },
};
