import {
  ResourceGeneratorParams, AsyncOptionsParams,
} from "../common/types";

export default {
  async *getResourcesStream({
    resourceFn, resourceName, hasPaging,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  }: ResourceGeneratorParams): AsyncGenerator<any> {
    let page = 0;
    do {
      page++;
      const nextResources = await resourceFn({
        params: {
          ...(hasPaging && {
            page,
          }),
        },
      });
      if (!nextResources) {
        throw new Error("No response from the API.");
      }
      if (!nextResources[resourceName]) {
        return;
      }
      for (const resource of nextResources[resourceName]) {
        yield resource;
      }
      if (!nextResources.has_more) {
        return;
      }
    } while (hasPaging);
  },
  async getAsyncOptions({
    resourceFn, page, resourceKey, labelKey, valueKey,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  }: AsyncOptionsParams): Promise<any> {
    const resources = await resourceFn({
      params: {
        page,
      },
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return resources[resourceKey]?.map((resource: any) => ({
      label: labelKey.split(".").reduce((acc, curr) => acc?.[curr], resource),
      value: valueKey.split(".").reduce((acc, curr) => acc?.[curr], resource),
    }));
  },
};
