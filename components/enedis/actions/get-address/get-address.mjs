import enedis from "../../enedis.app.mjs";
import common from "../common.mjs";

export default {
  type: "action",
  key: "enedis-get-address",
  version: "0.0.1",
  name: "Get Address",
  description: "Returns the address of a client.",
  ...common,
  props: {
    enedis,
    usagePointId: {
      propDefinition: [
        enedis,
        "usagePointId",
      ],
    },
  },
  methods: {
	...common.methods,
  },
  async run({ $ }) {
    return this.enedis.getAddress(
	  this.prepareParam()
	);
  },
};
