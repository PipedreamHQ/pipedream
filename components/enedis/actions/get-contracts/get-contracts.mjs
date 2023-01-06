import enedis from "../../enedis.app.mjs";

export default {
  type: "action",
  key: "enedis-get-contracts",
  version: "0.0.1",
  name: "Get contracts",
  description: "Returns the contract informations of a client.",
  props: {
    enedis,
    usage_point_id: {
      propDefinition: [
        enedis,
        "usage_point_id",
      ],
    },
  },
  async run({ $ }) {
    return await this.enedis.contracts(
	  this.enedis.prepareParam(this)
	);
  },
};
