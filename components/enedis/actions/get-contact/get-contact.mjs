import enedis from "../../enedis.app.mjs";

export default {
  type: "action",
  key: "enedis-get-contact",
  version: "0.0.1",
  name: "Get contact",
  description: "Returns the contact informations of a client.",
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
    return await this.enedis.contact(
	  this.enedis.prepareParam(this)
	);
  },
};
