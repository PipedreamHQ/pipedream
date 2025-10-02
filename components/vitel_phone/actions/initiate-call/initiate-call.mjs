import app from "../../vitel_phone.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "vitel_phone-initiate-call",
  name: "Initiate Call",
  description: "Initiate a call. [See the documentation](https://www.vitelglobal.com)",
  type: "action",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    fromnum: {
      type: "string",
      label: "From Number",
      description: "The logged-in user extension",
      optional: true,
    },
    tonum: {
      type: "string",
      label: "To Number",
      description: "The target number to call",
    },
  },
  methods: {
    initiateCall(args = {}) {
      return this.app.makeRequest({
        path: "/clicktocall/index.php",
        ...args,
      });
    },
    summary(resp) {
      const isStr = typeof resp === "string";
      const response = utils.checkResponse(resp);
      return isStr
        ? response
        : "Successfully initiated call";
    },
  },
  run({ $: step }) {
    const {
      // eslint-disable-next-line no-unused-vars
      app,
      initiateCall,
      summary,
      ...params
    } = this;

    return initiateCall({
      step,
      params,
      summary,
    });
  },
};
