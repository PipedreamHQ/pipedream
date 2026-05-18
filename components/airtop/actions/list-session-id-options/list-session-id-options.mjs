import airtop from "../../airtop.app.mjs";

export default {
  key: "airtop-list-session-id-options",
  name: "List Session ID Options",
  description: "Retrieves available options for the Session ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    airtop,
  },
  async run({ $ }) {
    const results = [];
    let page = 0;
    while (true) {
      const options = await airtop.propDefinitions.sessionId.options
        .call(this.airtop, {
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
