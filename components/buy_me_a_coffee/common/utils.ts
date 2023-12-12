import { ResourceGeneratorParams } from "../common/types";

export default {
  async *getResourcesStream({ resourceFn }: ResourceGeneratorParams): AsyncGenerator<any> {
    let page = 1;
    while (true) {
      const nextResources = await resourceFn({
        params: {
          page,
        },
      });
      page++;
      if (!nextResources) {
        throw new Error("No response from the API.");
      }
      if (!nextResources.data) {
        return;
      }
      for (const resource of nextResources.data) {
        yield resource;
      }
      if (nextResources.current_page == nextResources.last_page) {
        return;
      }
    }
  },
};
