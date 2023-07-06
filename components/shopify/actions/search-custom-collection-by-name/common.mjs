export default {
  props: {
    exactMatch: {
      type: "boolean",
      label: "Exact Match",
      description: "The custom collection title search should be an exact match",
      optional: true,
      default: false,
    },
  },
  async run({ $ }) {
    const {
      title,
      exactMatch,
    } = this;

    const params = {};
    if (exactMatch) {
      params.title = title;
    }

    let collections = await this.shopify.getObjects("customCollection", params);

    if (!exactMatch) {
      const lowerCaseTitle = title.toLowerCase();
      collections = collections.filter(({ title }) =>
        title.toLowerCase().includes(lowerCaseTitle));
    }

    $.export("$summary", `Found ${collections.length} collection(s) matching search criteria.`);
    return collections;
  },
};
