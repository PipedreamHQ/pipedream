// Pipedream component: Screen Batch (Palavir Compliance)
//
// Screen up to 100 entities in one call.

import { axios } from "@pipedream/platform";

export default {
  key: "palavir_compliance-screen-batch",
  name: "Screen Batch — Up to 100 Entities",
  description:
    "Screen up to 100 entities in one call against LEIE + OFAC + SAM. Returns per-entity results plus summary counts.",
  type: "action",
  version: "0.1.0",
  props: {
    palavir_compliance: {
      type: "app",
      app: "palavir_compliance",
    },
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

    const response = await axios($, {
      method: "POST",
      url: "https://federal-exclusion-sanctions-screener.p.rapidapi.com/api/screen/batch",
      headers: {
        "Content-Type": "application/json",
        "X-RapidAPI-Key": this.palavir_compliance.$auth.api_key,
        "X-RapidAPI-Host": "federal-exclusion-sanctions-screener.p.rapidapi.com",
      },
      data: { entities },
    });

    const { total, clear, matched, potential } = response.summary || {};
    $.export(
      "$summary",
      `Screened ${total} entities — ${matched} matched, ${potential} potential, ${clear} clear`
    );
    return response;
  },
};
