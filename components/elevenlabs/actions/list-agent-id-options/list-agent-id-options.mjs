import elevenlabs from "../../elevenlabs.app.mjs";

export default {
  key: "elevenlabs-list-agent-id-options",
  name: "List Agent ID Options",
  description: "Retrieves available options for the Agent ID field. [See the documentation](https://elevenlabs.io/docs/eleven-agents/api-reference/agents/list)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    elevenlabs,
  },
  async run({ $ }) {
    const options = [];
    let cursor;
    do {
      const {
        agents, next_cursor: nextCursor,
      } = await this.elevenlabs.listAgents({
        $,
        params: {
          cursor,
          page_size: 30,
        },
      });
      options.push(...(agents?.map(({
        agent_id: value, name: label,
      }) => ({
        label,
        value,
      })) || []));
      cursor = nextCursor;
    } while (cursor);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
