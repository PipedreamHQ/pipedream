import fs from "fs";

const PAGE_SIZE = 25;

export default {
  isValidFile(filePath) {
    const filePathWithTmp = `/tmp/${filePath}`;
    if (fs.existsSync(filePathWithTmp)) {
      return filePathWithTmp;
    }
    if (fs.existsSync(filePath)) {
      return filePath;
    }
    return false;
  },
  extractProps(that, pairs) {
    const {
      // eslint-disable-next-line no-unused-vars
      app,
      ...props
    } = that;
    return Object.keys(props)
      .reduce((acc, key) => {
        const keyMapped = pairs[key];
        const value = props[key];
        const newKey = keyMapped ?? key;
        return {
          ...acc,
          [newKey]: value,
        };
      }, {});
  },
  async asyncPropHandler({
    resourceFn, page, mapper, params, resourceKey = "results",
  } = {}) {
    const { [resourceKey]: items } =
      await resourceFn({
        params: {
          ...params,
          ...(typeof page != "undefined" && {
            from: page * PAGE_SIZE,
            size: PAGE_SIZE,
          }),
        },
      });
    return items.map(mapper);
  },
  async *getResourcesStream({
    resourceFn, resourceFnArgs, resourceKey,
  }) {
    let page = 0;
    while (true) {
      const { [resourceKey]: nextResources } =
        await resourceFn({
          ...resourceFnArgs,
          params: {
            ...resourceFnArgs?.params,
            from: page++ * PAGE_SIZE,
            size: PAGE_SIZE,
          },
        });
      if (!nextResources?.length) {
        console.log("No more resources");
        return;
      }
      for (const resource of nextResources) {
        yield resource;
      }
      if (nextResources?.length < PAGE_SIZE) {
        console.log("Number of resources less than page size");
        return;
      }
    }
  },
};
