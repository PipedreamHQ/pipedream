import addevent from "../../addevent.app.mjs";

export default {
  key: "addevent-list-event-id-options",
  name: "List Event ID Options",
  description: "Retrieves available options for the Event ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    addevent,
  },
  async run({ $ }) {
    const results = [];
    let page = 0;
    while (true) {
      const options = await addevent.propDefinitions.eventId.options
        .call(this.addevent, {
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
