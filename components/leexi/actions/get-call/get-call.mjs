import app from "../../leexi.app.mjs";

export default {
  key: "leexi-get-call",
  name: "Get Call",
  description: "Get details of a call by its ID. [See the documentation](https://developer.leexi.ai/)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    callId: {
      propDefinition: [
        app,
        "callId",
      ],
    },
  },
  methods: {
    getCall({
      callId, ...args
    } = {}) {
      return this.app._makeRequest({
        path: `/calls/${callId}`,
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      getCall,
      callId,
    } = this;

    const response = await getCall({
      $,
      callId,
    });
    $.export("$summary", `Successfully retrieved details for call ID \`${response.data?.uuid}\`.`);
    return response;
  },
};
