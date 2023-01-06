import enedis from "../../enedis.app.mjs";

export default {
  type: "action",
  key: "enedis-get-address",
  version: "0.0.1",
  name: "Get address",
  description: "Returns the address of a client.",
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
    return await this.enedis.address(
	  this.enedis.prepareParam(this)
	);
  },
};
