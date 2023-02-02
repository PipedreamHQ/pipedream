const pageSize = 10; //there is a limit of 10 on some of the resources

export default {
  async *getResourcesStream({
    resourceFn,
    queryFn,
    queryArgs,
    cursorKey,
    resourceKey,
  }) {
    let after;
    while (true) {
      const nextResources = await resourceFn({
        query: queryFn({
          ...queryArgs,
          after,
          pageSize,
        }),
      });
      if (!nextResources) {
        throw new Error("No response from the API.");
      }
      if (nextResources.errors) {
        throw new Error(nextResources.errors[0]?.message);
      }
      const newAfter = cursorKey.split(".").reduce((acc, curr) => acc?.[curr], nextResources);
      const resources = resourceKey.split(".").reduce((acc, curr) => acc?.[curr], nextResources);
      for (const resource of resources) {
        yield resource;
      }
      if (!newAfter || newAfter == after) {
        return;
      }
      after = newAfter;
    }
  },
};
