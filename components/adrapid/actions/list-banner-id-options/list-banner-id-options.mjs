import adrapid from "../../adrapid.app.mjs";

export default {
  key: "adrapid-list-banner-id-options",
  name: "List Banner Id Options",
  description: "Retrieves available options for the Banner Id field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    adrapid,
  },
  async run({ $ }) {
    const results = [];
    let page = 0;
    while (true) {
      const options = await adrapid.propDefinitions.bannerId.options
        .call(this.adrapid, {
          page,
        });
      if (!options?.length) break;
      results.push(...options);
      page++;
    }
    $.export("$summary", `Successfully retrieved ${results.length} option${results.length === 1
      ? ""
      : "s"}`);
    return results;
  },
};
