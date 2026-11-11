import ramp from "../../ramp.app.mjs";

export default {
  key: "ramp-list-locations",
  name: "List Locations",
  description: "Retrieve a list of Ramp locations. Use this to find location IDs for other actions such as **Update User** and **List Transactions**. Example: returns objects like `{ \"id\": \"961c6f01-5719-4f4c-8fef-4096a031f32a\", \"name\": \"New York HQ\", \"entity_id\": \"c0e5f8a2-9b1d-4e3a-8f6c-2d7b4a1e9f30\" }` — pass the `id` as the location ID in downstream actions. Returns one page of up to `pageSize` results (max 100); a `page.next` value in the response means more locations exist beyond this page. [See the documentation](https://docs.ramp.com/developer-api/v1/api/locations#get-developer-v1-locations)",
  version: "0.0.3",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    ramp,
    pageSize: {
      propDefinition: [
        ramp,
        "pageSize",
      ],
    },
    start: {
      propDefinition: [
        ramp,
        "start",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.ramp.listLocations({
      $,
      params: {
        page_size: this.pageSize,
        start: this.start,
      },
    });
    $.export("$summary", `Successfully retrieved ${response.data?.length ?? 0} location(s)`);
    return response;
  },
};
