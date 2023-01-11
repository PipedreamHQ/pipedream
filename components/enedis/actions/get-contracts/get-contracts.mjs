import enedis from "../../enedis.app.mjs";
import common from "../common.mjs";

export default {
  type: "action",
  key: "enedis-get-contracts",
  version: "0.0.1",
  name: "Get Contracts",
  description: "Returns the contract informations of a client. [See the docs here](https://datahub-enedis.fr/data-connect/documentation/customers-v5-contrats/)",
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
    const response = this.enedis.getContracts(
	  this.prepareParam()
	);
    $.export("$summary", "The contracts informations were successfully fetched!");
    return response;
  },
};
