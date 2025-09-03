import trustpilot from "../../trustpilot.app.mjs";

export default {
  key: "trustpilot-search-business-units-test",
  name: "Search Business Units (Test)",
  description: "Temporary action to test the searchBusinessUnits implementation. Searches for business units by name or domain.",
  version: "0.0.4",
  type: "action",
  props: {
    trustpilot,
    query: {
      type: "string",
      label: "Search Query",
      description: "Search term to find business units (name or domain)",
      default: "stoov",
      optional: true,
    },
    page: {
      type: "integer",
      label: "Page",
      description: "Page number for pagination",
      min: 1,
      default: 1,
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      query,
      page,
    } = this;

    try {
      const businessUnits = await this.trustpilot.searchBusinessUnits({
        query,
        page,
      });

      const options = businessUnits.map((businessUnit) => {
        const {
          id, displayName,
        } = businessUnit;

        return {
          label: displayName,
          value: id,
        };
      });

      $.export("$summary", `Found ${businessUnits.length} business unit(s) for query: "${query}"`);

      return {
        businessUnits,
        options,
        metadata: {
          query,
          page,
          count: businessUnits.length,
          requestTime: new Date().toISOString(),
        },
      };
    } catch (error) {
      throw new Error(`Failed to search business units: ${error.message}`);
    }
  },
};
