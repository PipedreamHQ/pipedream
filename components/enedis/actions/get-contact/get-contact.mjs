import enedis from "../../enedis.app.mjs";
import common from "../common.mjs";

export default {
  type: "action",
  key: "enedis-get-contact",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  name: "Get Contact",
  description: "Returns the contact informations of a client. [See the docs here](https://datahub-enedis.fr/data-connect/documentation/customers-v5-contact/)",
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
    const response = this.enedis.getContact(
      this.prepareParam(),
    );
    $.export("$summary", "The contact informations was successfully fetched!");
    return response;
  },
};
