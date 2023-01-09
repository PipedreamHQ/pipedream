import enedis from "../../enedis.app.mjs";
import common from "../common.mjs";

export default {
  type: "action",
  key: "enedis-get-contracts",
  version: "0.0.1",
  name: "Get Contracts",
  description: "Returns the contract informations of a client.",
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
    return this.enedis.getContracts(
	  this.prepareParam()
	);
  },
};
