import snowflake from "../../snowflake.app.mjs";

export default {
  type: "action",
  ai: "optimized",
  key: "snowflake-start-sql-session",
  name: "Start SQL Session",
  description: "Start a Snowflake session and return it in serialized form, so subsequent Snowflake actions can run in the same session (preserving temporary tables, `USE` context, and session parameters) by passing it to their **Session** prop. The returned value contains session auth tokens — treat it as sensitive. Sessions expire server-side after ~4 hours or your account's idle timeout. [See the documentation](https://docs.snowflake.com/en/developer-guide/node-js/nodejs-driver-connect)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    snowflake,
  },
  async run({ $ }) {
    const session = await this.snowflake.serializeSession();
    $.export("$summary", "Successfully started Snowflake session");
    return {
      session,
    };
  },
};
