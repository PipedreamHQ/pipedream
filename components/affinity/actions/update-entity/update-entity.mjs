import { axios } from "@pipedream/platform";
import affinity from "../../affinity.app.mjs";

export default {
  key: "affinity-update-entity",
  name: "Update Entity",
  description: "Updates the fields of a person, organization, or opportunity in Affinity. [See the documentation](https://api-docs.affinity.co/)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    affinity,
    entityIdentification: {
      propDefinition: [
        affinity,
        "entityIdentification",
      ],
    },
    updatedFields: {
      propDefinition: [
        affinity,
        "updatedFields",
      ],
    },
  },
  async run({ $ }) {
    const entityId = this.entityIdentification.id;
    const response = await this.affinity.updateEntity(entityId, this.updatedFields);
    $.export("$summary", `Successfully updated entity with ID: ${entityId}`);
    return response;
  },
};
