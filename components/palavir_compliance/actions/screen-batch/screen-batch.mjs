// Pipedream component: Screen Batch (Palavir Compliance)
//
// Screen up to 100 entities in one call.

import palavir_compliance from "../../palavir_compliance.app.mjs";

export default {
  key: "palavir_compliance-screen-batch",
  name: "Screen Batch — Up to 100 Entities",
  description:
    "Screen up to 100 entities in one call against LEIE + OFAC + SAM. Returns per-entity results plus summary counts. [See the documentation](https://palavir.co/exclusion-screening)",
  type: "action",
  version: "0.0.1",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    palavir_compliance,
    entities: {
      type: "object",
      label: "Entities",
      description:
        "Array of entities, each with `name` (required) and optional `npi`, `state`, `dob`. Max 100. Example: `[{\"name\":\"John Smith\",\"npi\":\"1234567890\"}]`",
    },
  },
  async run({ $ }) {
    const entities = Array.isArray(this.entities) ? this.entities : this.entities.entities;
    if (!Array.isArray(entities) || entities.length === 0 || entities.length > 100) {
      throw new Error("`entities` must be an array of 1-100 objects");
    }

    const response = await this.palavir_compliance.screenBatch($, { entities });

    const summary = response?.summary ?? {};
    const total = summary.total ?? entities.length;
    const matched = summary.matched ?? 0;
    const potential = summary.potential ?? 0;
    const clear = summary.clear ?? 0;
    $.export(
      "$summary",
      `Screened ${total} entities — ${matched} matched, ${potential} potential, ${clear} clear`
    );
    return response;
  },
};
