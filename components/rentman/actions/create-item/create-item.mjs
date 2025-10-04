import {
  ADDITIONAL_PROPS, CONTACT_NAME_FIELDS,
} from "../../common/props.mjs";
import { snakeCaseData } from "../../common/utils.mjs";
import rentman from "../../rentman.app.mjs";

export default {
  key: "rentman-create-item",
  name: "Create Item",
  description: "Creates a new item based on the specified type. [See the documentation](https://api.rentman.net)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    rentman,
    itemType: {
      propDefinition: [
        rentman,
        "itemType",
      ],
      reloadProps: true,
    },
  },
  async additionalProps() {
    let props = {};
    if (this.itemType) {
      props = ADDITIONAL_PROPS[this.itemType];
      if (this.itemType === "contacts" && this.type) {
        props = {
          ...props,
          ...CONTACT_NAME_FIELDS[this.type],
        };
      }
    }
    return props;
  },
  async run({ $ }) {
    const {
      rentman,
      itemType,
      contactId,
      invoiceId,
      projectId,
      equipmentId,
      projectRequestId,
      crewId,
      ...data
    } = this;

    const response = await rentman.createItem({
      $,
      itemType,
      parentId: contactId || projectId || crewId || invoiceId || projectRequestId || equipmentId,
      data: snakeCaseData(data),
    });

    $.export("$summary", `New ${itemType} succesfully created with Id: ${response.data.id} `);
    return response;
  },
};
