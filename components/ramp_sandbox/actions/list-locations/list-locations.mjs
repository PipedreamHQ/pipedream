// x-pd-ai: optimized
import ramp from "../../ramp_sandbox.app.mjs";
import listLocations from "../../../ramp/actions/list-locations/list-locations.mjs";

export default {
  ...listLocations,
  key: "ramp_sandbox-list-locations",
  name: "List Locations",
  description: "Retrieve a list of Ramp Sandbox locations. Use this to find location IDs for other actions such as **Update User** and **List Transactions**. Example: returns `{ id, name, entity_id }` such as `{ \"name\": \"New York HQ\" }`. Returns one page of up to `pageSize` results (max 100); a `page.next` value in the response means more locations exist beyond this page. [See the documentation](https://docs.ramp.com/developer-api/v1/api/locations#get-developer-v1-locations).",
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
