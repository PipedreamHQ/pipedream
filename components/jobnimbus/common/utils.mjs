import fs from "fs";

const PAGE_SIZE = 25;

export default {
  isValidFile(filePath) {
    const filePathWithTmp = `/tmp/${filePath}`;
    if (fs.existsSync(filePathWithTmp)) {
      return filePathWithTmp;
    } else if (fs.existsSync(filePath)) {
      return filePath;
    } else {
      return false;
    }
  },
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
    resourceFn, page, labelVal, params, resourceKey,
  } = {}) {
    let resp;
    resp = await resourceFn({
      params: {
        ...params,
        ...(typeof page != "undefined" && {
          from: page * PAGE_SIZE,
          size: PAGE_SIZE,
        }),
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
  async *getResourcesStream({
    resourceFn, resourceFnArgs, resourceKey,
  }) {
    let page = 0;
    while (true) {
      const nextResources = await resourceFn({
        ...resourceFnArgs,
        params: {
          ...resourceFnArgs?.params,
          from: page++ * PAGE_SIZE,
          size: PAGE_SIZE,
        },
      });
      const resources = resourceKey.split(".").reduce((acc, curr) => acc?.[curr], nextResources);
      if (!resources?.length)
        return;
      for (const resource of resources) {
        yield resource;
      }
      if (nextResources?.length < PAGE_SIZE) {
        return;
      }
    }
  },
};
