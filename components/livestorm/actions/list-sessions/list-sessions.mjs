import app from "../../livestorm.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "livestorm-list-sessions",
  name: "List Sessions",
  description: "List all your event sessions. [See the Documentation](https://developers.livestorm.co/reference/get_sessions)",
  type: "action",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
  },
  async run({ $: step }) {
    const stream = this.app.getResourcesStream({
      resourceFn: this.app.listSessions,
      resourceFnArgs: {
        step,
      },
    });

    const resources = await utils.streamIterator(stream);

    step.export("$summary", `Successfully retrieved ${utils.summaryEnd(resources.length, "session")}.`);

    return resources;
  },
};
