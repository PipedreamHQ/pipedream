import app from "../../upstash_redis.app.mjs";

export default {
  key: "upstash_redis-list-databases",
  name: "List Redis Databases",
  description: "Lists all Redis databases. [See the documentation](https://upstash.com/docs/devops/developer-api/redis/list_databases)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
  },
  async run({ $ }) {
    const response = await this.app.listDatabases({
      $,
    });
    $.export("$summary", `Successfully listed \`${response.length}\` Redis database(s)`);
    return response;
  },
};
