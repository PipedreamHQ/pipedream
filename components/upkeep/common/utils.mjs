const pageSize = 25;

export default {
  parseOne(obj) {
    let parsed;
    try {
      parsed = JSON.parse(obj);
    } catch (e) {
      parsed = obj;
    }
    return parsed;
  },
  parseObject(obj) {
    if (typeof obj === "string")
      obj = JSON.parse(obj);
    let parsed = {};
    for (let key in obj) {
      if (typeof obj[key] != "object" && typeof obj[key] != "number")
        parsed[key] = this.parseOne(obj[key].replace(/(['"])?([a-z0-9A-Z_]+)(['"])?:/g, "\"$2\": ")); //replacing single quotes with doubles
      else
        parsed[key] = obj[key];
    }
    return parsed;
  },
  parseArray(arr) {
    const result = [];
    if (!arr)
      return arr;
    for (let obj of arr) {
      result.push(this.parseOne(obj));
    }
    return result;
  },
  async asyncPropHandler({
    resourceFn, page, labelVal,
  } = {}) {
    let resp;
    try {
      resp = await resourceFn({
        params: {
          offset: page * pageSize,
          limit: (page + 1) * pageSize,
        },
      });
    } catch (err) {
      return [];
    }
    return resp.results.map((item) => ({
      label: typeof labelVal.label == "string" ?
        item[labelVal.label] :
        labelVal.label(item),
      value: item[labelVal.value],
    }));
  },
  async *getResourcesStream({
    resourceFn,
    resourceFnArgs,
    resourceLimit,
  }) {
    let page = 0, resourceCount = 0;
    while (true) {
      try {
        const nextResources = await resourceFn({
          ...resourceFnArgs,
          params: {
            ...resourceFnArgs?.params,
            offset: page * pageSize,
            limit: ++page * pageSize,
          },
        });
        if (!nextResources?.results?.length)
          return;
        for (const resource of nextResources.results) {
          if (resourceLimit && resourceLimit < ++resourceCount)
            return;
          else
            yield resource;
        }
      } catch (err) { //sometimes the API returns an empty list, sometimes it returns a 404
        return;
      }
    }
  },
};
