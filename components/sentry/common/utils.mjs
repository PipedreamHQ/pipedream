import slugify from "slugify";

export default {
  formatIntegrationName(rawName) {
    const options = {
      remove: /[()]/g,
      lower: true,
    };
    const enrichedRawName = `pd-${rawName}`;
    return slugify(enrichedRawName, options).substring(0, 57);
  },
};
