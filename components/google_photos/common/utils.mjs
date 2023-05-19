import fs from "fs";

const PAGE_SIZE = 20;

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
  async asyncPropHandler({
    resourceFn, resourceKey, pageToken, labelVal, params,
  } = {}) {
    let resp = await resourceFn({
      ...params,
      params: {
        ...params?.params,
        ...(pageToken ?
          {
            pageToken,
          } :
          {}
        ),
      },
    });
    const { nextPageToken } = resp;
    const items = resourceKey.split(".").reduce((acc, curr) => acc?.[curr], resp) || [];
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
    return nextPageToken
      ? {
        options,
        context: {
          pageToken: nextPageToken,
        },
      } :
      options;
  },
  async *getResourcesStream({
    resourceFn, resourceFnArgs, resourceLimit, resourceKey,
  }) {
    let resourceCount = 0, nextPageToken;
    while (true) {
      const nextResources = await resourceFn({
        ...resourceFnArgs,
        params: {
          ...resourceFnArgs?.params,
          pageSize: PAGE_SIZE,
          ...(nextPageToken ?
            {
              pageToken: nextPageToken,
            } :
            {}
          ),
        },
      });
      nextPageToken = nextResources?.nextPageToken;
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
      if (!nextPageToken) {
        return;
      }
    }
  },
};
