import companyenrich from "../../companyenrich.app.mjs";
import {
  personId, personExpansions,
} from "../../common/utils.mjs";

export default {
  key: "companyenrich-get-person",
  name: "Get Person",
  description: "Retrieve a professional profile by its ID from **Search People**. Costs 2 credits when returned; education adds 1 credit. The person ID is accepted as decimal text to preserve its exact value. [See the documentation](https://docs.companyenrich.com/reference/get_v2-people-personid)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    companyenrich,
    personId: {
      propDefinition: [
        companyenrich,
        "personId",
      ],
    },
    personExpand: {
      propDefinition: [
        companyenrich,
        "personExpand",
      ],
    },
  },
  /**
   * Validate the person ID without numeric conversion and retrieve the profile.
   * @param {Object} context - Pipedream action execution context.
   * @param {Object} context.$ - Execution context used for requests and the result summary.
   * @returns {Promise<Object>} The person record and requested expansions, preserving large
   * IDs as text.
   */
  async run({ $ }) {
    const response = await this.companyenrich.getPerson({
      $,
      personId: personId(this.personId),
      params: {
        expand: personExpansions(this.personExpand),
      },
    });
    $.export("$summary", "Retrieved person profile");
    return response;
  },
};
