// x-pd-ai: optimized
import ramp from "../../ramp_sandbox.app.mjs";
import listLocations from "@pipedream/ramp/actions/list-locations/list-locations.mjs";

export default {
  ...listLocations,
  key: "ramp_sandbox-list-locations",
  name: "List Locations",
  description: "Retrieve a list of Ramp Sandbox locations. Use this to find location IDs for other actions such as **Update User** and **List Transactions**. Example: returns `{ id, name, entity_id }` such as `{ \"id\": \"961c6f01-5719-4f4c-8fef-4096a031f32a\", \"name\": \"New York HQ\", \"entity_id\": \"dff9389a-2819-468e-a220-28e059b23f8e\" }`. Returns one page of up to `pageSize` results (max 100); a `page.next` value in the response means more locations exist beyond this page. [See the documentation](https://docs.ramp.com/developer-api/v1/api/locations#get-developer-v1-locations)",
  version: "0.0.2",
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
