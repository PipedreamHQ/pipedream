const DEFAULT_PAGE_SIZE = 30;

export default {
  extractPropValues(val) {
    if (Array.isArray(val)) {
      const arr = [];
      for (let item of val) {
        arr.push(this.extractOne(item));
      }
      return arr;
    } else {
      return this.extractOne(val);
    }
  },
  extractOne(val) {
    let result;
    try {
      result = JSON.parse(val);
    } catch (err) {
      result = val;
    }
    return result;
  },
  getFieldDesc(field, isUpdate) {
    let description = "";
    if (!isUpdate) {
      description += field.config.required ?
        "[REQUIRED] " :
        "[OPTIONAL] ";
    }
    description += field.config.description || "";
    if (field.type != "number" && field.type != "text" && field.type != "category") {
      description += `\nA valid JSON object(type ${field.type}) should be given. Please see [this doc](https://developers.podio.com/doc/applications) to see field objects`;
    }
    return description;
  },
  getType(field) {
    let type = "string";
    if (field.type == "number") {
      type = "integer";
    }
    if (field.config.settings.multiple) {
      type += "[]";
    }
    return type;
  },
  async *getResourcesStream({
    resourceFn,
    resourceFnArgs,
    resourceFnHasPaging,
    resourceKey,
  }) {
    let offset = 0;
    while (true) {
      const nextResources = await resourceFn({
        ...resourceFnArgs,
        data: {
          ...resourceFnArgs?.data,
          ...(resourceFnHasPaging && {
            limit: DEFAULT_PAGE_SIZE,
            offset,
          }),
        },
      });
      if (!nextResources) {
        throw new Error("No response from the API.");
      }
      for (const resource of (resourceFnHasPaging
        ? nextResources.items
        : nextResources)) {
        yield resource;
      }
      if ((resourceFnHasPaging && nextResources[resourceKey].length == 0) || !resourceFnHasPaging) {
        return;
      }
      offset += DEFAULT_PAGE_SIZE;
    }
  },
};
