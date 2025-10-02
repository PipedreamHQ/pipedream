import utils from "../../common/utils.mjs";
import app from "../../upstash_redis.app.mjs";

export default {
  key: "upstash_redis-post-command",
  name: "Post Command",
  description: "Post a command to a Redis database. [See the documentation](https://upstash.com/docs/redis/features/restapi#post-command-in-body)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    command: {
      type: "string",
      label: "Command",
      description: "The command to post to the database.",
      options: [
        "SET",
        "GET",
      ],
    },
    args: {
      type: "string[]",
      label: "Arguments",
      description: "The arguments for the command. Eg. `[\"mykey\", \"myvalue\"]`",
    },
  },
  methods: {
    postCommand(args = {}) {
      return this.app.post(args);
    },
  },
  async run({ $ }) {
    const {
      postCommand,
      command,
      args,
    } = this;
    const response = await postCommand({
      $,
      data: [
        command,
        ...utils.parseArray(args),
      ],
    });

    $.export("$summary", "Successfully posted command to the database.");
    return response;
  },
};
