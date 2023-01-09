import enedis from "../../enedis.app.mjs";
import common from "../common.mjs";

export default {
  type: "action",
  key: "enedis-get-contact",
  version: "0.0.1",
  name: "Get Contact",
  description: "Returns the contact informations of a client.",
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
    return this.enedis.getContact(
	  this.prepareParam()
	);
  },
};
