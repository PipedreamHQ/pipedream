import {
  ResourceGeneratorParams, AsyncOptionsParams,
} from "../common/types";

const pageSize = 25;

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
            page_size: pageSize,
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
      if (nextResources.page_size * page >= nextResources.total_count) {
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
        page_size: pageSize,
      },
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return resources[resourceKey]?.map((resource: any) => ({
      label: resource[labelKey],
      value: resource[valueKey],
    }));
  },
};
