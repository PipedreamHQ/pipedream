import aircall from "../../aircall.app.mjs";

export default {
  name: "Get Call",
  description: "Retrieves details about a call. [See the docs here](https://developer.aircall.io/api-references/#retrieve-a-call)",
  key: "aircall-get-call",
  version: "0.0.1",
  type: "action",
  props: {
    aircall,
    call: {
      propDefinition: [
        aircall,
        "call",
      ],
    },
  },
  async run({ $ }) {
    const { call } = await this.aircall.getCall(this.call, $);

    $.export("$summary", `Successfully retrieved call with ID ${call.id}`);

    return call;
  },
};
