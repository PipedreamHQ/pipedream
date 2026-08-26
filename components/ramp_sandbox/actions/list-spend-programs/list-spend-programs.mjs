// x-pd-ai: optimized
import ramp from "../../ramp_sandbox.app.mjs";
import listSpendPrograms from "@pipedream/ramp/actions/list-spend-programs/list-spend-programs.mjs";

export default {
  ...listSpendPrograms,
  key: "ramp_sandbox-list-spend-programs",
  name: "List Spend Programs",
  description: "Retrieve a list of Ramp Sandbox spend programs. Returns a compact summary of each program by default (id, name, description, icon); pass `fields` to include specific extra fields such as `restrictions`. Returns one page of up to `pageSize` results (max 100); a `page.next` value in the response means more programs exist beyond this page. [See the documentation](https://docs.ramp.com/developer-api/v1/api/spend-programs#get-developer-v1-spend-programs).",
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
    fields: {
      propDefinition: [
        ramp,
        "fields",
      ],
      description: "Optional list of spend-program fields to include per record in addition to the compact default (e.g. `restrictions`, `permitted_spend_types`). Leave empty for the compact summary.",
    },
  },
};
