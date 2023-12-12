import base from "../common/base.mjs";

export default {
  ...base,
  key: "adalo-get-records",
  name: "Get Records",
  description: "Get all records from a collection. [See docs here](https://help.adalo.com/integrations/the-adalo-api/collections)",
  version: "0.0.2",
  type: "action",
  async run({ $ }) {
    let resources = [];
    let offset = 0;
    let total = 1;

    do {
      const response =
        await this.adalo.paginateResources({
          requestFn: this.adalo.getRecords,
          requestArgs: {
            $,
            collectionId: this.collectionId,
            params: {
              offset,
            },
          },
          resourceName: "records",
          mapper: (resource) => resource,
        });

      const { options: nextResources } = response;
      ({
        offset, total,
      } = response.context);

      resources = resources.concat(nextResources);

    } while (resources.length < total);

    $.export("$summary", "Successfully retrieved records");

    return resources;
  },
};
