import alive5 from "../../alive5.app.mjs";

export default {
  key: "alive5-list-channels-and-users",
  name: "List Channels and Users",
  description: "List Alive5 channels and their assigned users. [See the documentation](https://www.alive5.com/api)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: false,
    readOnlyHint: true,
  },
  props: {
    alive5,
  },
  async run({ $ }) {
    const channels = await this.alive5.listChannels({
      $,
    });
    $.export("$summary", `Retrieved ${channels.length} channels.`);
    return channels;
  },
};
