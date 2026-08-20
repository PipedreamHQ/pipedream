import ramp from "../../ramp.app.mjs";

export default {
  key: "ramp-list-locations",
  name: "List Locations",
  description: "Retrieve a list of Ramp locations. Use this to find location IDs for other actions such as **Update User** and **List Transactions**. Example: returns `{ id, name, entity_id }` such as `{ \"name\": \"New York HQ\" }`. Returns one page of up to `pageSize` results (max 100); a `page.next` value in the response means more locations exist beyond this page. [See the documentation](https://docs.ramp.com/developer-api/v1/api/locations#get-developer-v1-locations).",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    ramp,
    pageSize: {
      type: "integer",
      label: "Page Size",
      description: "Number of results per page, between 2 and 100 (default 20).",
      min: 2,
      max: 100,
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.ramp.listLocations({
      $,
      params: {
        page_size: this.pageSize,
      },
    });
    $.export("$summary", `Successfully retrieved ${response.data?.length ?? 0} location(s)`);
    return response;
  },
};
