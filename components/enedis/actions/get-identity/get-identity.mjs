import enedis from "../../enedis.app.mjs";
import common from "../common.mjs";

export default {
  type: "action",
  key: "enedis-get-identity",
  version: "0.0.1",
  name: "Get Identity",
  description: "Returns the identity of a client.",
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
    return this.enedis.getIdentity(
	  this.prepareParam()
	);
  },
};
