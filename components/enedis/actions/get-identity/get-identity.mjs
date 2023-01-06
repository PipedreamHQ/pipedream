import enedis from "../../enedis.app.mjs";

export default {
  type: "action",
  key: "enedis-get-identity",
  version: "0.0.1",
  name: "Get identity",
  description: "Returns the identity of a client.",
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
    return await this.enedis.identity(
	  this.enedis.prepareParam(this)
	);
  },
};
