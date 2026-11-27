import slugify from "slugify";

export default {
  pickFields(obj, names) {
    return Object.fromEntries(
      [
        "id",
        ...names,
      ].filter((k) => obj && k in obj)
        .map((k) => [
          k,
          obj[k],
        ]),
    );
  },
  formatIntegrationName(rawName) {
    const options = {
      remove: /[()]/g,
      lower: true,
    };
    const enrichedRawName = `pd-${rawName}`;
    return slugify(enrichedRawName, options).substring(0, 57);
  },
};
