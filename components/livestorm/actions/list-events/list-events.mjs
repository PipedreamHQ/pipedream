import app from "../../livestorm.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "livestorm-list-events",
  name: "List Events",
  description: "List the events of your workspace. [See the Documentation](https://developers.livestorm.co/reference/get_events)",
  type: "action",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    titleFilter: {
      type: "string",
      label: "Title Filter",
      description: "Filter events by title.",
      optional: true,
    },
  },
  async run({ $: step }) {
    const stream = this.app.getResourcesStream({
      resourceFn: this.app.listEvents,
      resourceFnArgs: {
        step,
        params: {
          ["filter[title]"]: this.titleFilter,
        },
      },
    });

    const resources = await utils.streamIterator(stream);

    step.export("$summary", `Successfully retrieved ${utils.summaryEnd(resources.length, "event")}.`);

    return resources;
  },
};
