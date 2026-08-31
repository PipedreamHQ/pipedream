// x-pd-ai: optimized
import ramp from "../../ramp_sandbox.app.mjs";
import listLocations from "@pipedream/ramp/actions/list-locations/list-locations.mjs";

export default {
  ...listLocations,
  key: "ramp_sandbox-list-locations",
  name: "List Locations",
  description: "Retrieve a list of Ramp Sandbox locations. Use this to find location IDs for other actions such as **Update User** and **List Transactions**. Example: returns objects like `{ \"id\": \"961c6f01-5719-4f4c-8fef-4096a031f32a\", \"name\": \"New York HQ\", \"entity_id\": \"c0e5f8a2-9b1d-4e3a-8f6c-2d7b4a1e9f30\" }` — pass the `id` as the location ID in downstream actions. Returns one page of up to `pageSize` results (max 100); a `page.next` value in the response means more locations exist beyond this page. [See the documentation](https://docs.ramp.com/developer-api/v1/api/locations#get-developer-v1-locations)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
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
};
