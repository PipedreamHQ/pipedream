import supabase from "../../supabase.app.mjs";

export default {
  key: "supabase-remote-procedure-call",
  name: "Remote Procedure Call",
  type: "action",
  version: "0.0.3",
  description: "Call a Postgres function in a database. [See the docs here](https://supabase.com/docs/reference/javascript/rpc)",
  props: {
    supabase,
    functionName: {
      type: "string",
      label: "Function Name",
      description: "The function name to call",
    },
    args: {
      type: "object",
      label: "Arguments",
      description: "The arguments to pass to the function call",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.supabase.remoteProcedureCall(this.functionName, this.args);
    if (response) {
      $.export("$summary", `Successfully executed remote procedure call ${this.functionName}`);
    }
    return response;
  },
};
