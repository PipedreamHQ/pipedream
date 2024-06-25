import hubspot from "../../hubspot.app.mjs";
import {
  DEFAULT_CONTACT_PROPERTIES,
  DEFAULT_COMPANY_PROPERTIES,
  DEFAULT_DEAL_PROPERTIES,
  DEFAULT_TICKET_PROPERTIES,
  DEFAULT_PRODUCT_PROPERTIES,
  DEFAULT_LINE_ITEM_PROPERTIES,
} from "../../common/constants.mjs";

export default {
  props: {
    hubspot,
    objectId: {
      type: "string",
      label: "Object ID",
      description: "Hubspot's internal ID for the object",
      async options(opts) {
        return this.hubspot.createOptions(this.getObjectType(), opts);
      },
      reloadProps: true,
    },
    info: {
      type: "alert",
      alertType: "info",
      content: "",
      hidden: true,
    },
    // eslint-disable-next-line pipedream/props-description
    additionalProperties: {
      type: "string[]",
      label: "Additional properties to retrieve",
      optional: true,
      async options({ page }) {
        if (page !== 0) {
          return [];
        }
        const { results: properties } = await this.hubspot.getProperties({
          objectType: this.getObjectType(),
        });
        const defaultProperties = this.getDefaultProperties(this.getObjectType());
        return properties
          .filter(({ name }) => !defaultProperties.includes(name))
          .map((property) => ({
            label: property.label,
            value: property.name,
          }));
      },
    },
  },
  async additionalProps(props) {
    return {
      info: {
        ...props.info,
        content: `Properties:\n\`${this.getDefaultProperties(this.getObjectType()).join(", ")}\``,
        hidden: false,
      },
    };
  },
  methods: {
    getObjectType() {
      throw new Error("getObjectType is not implemented");
    },
    getDefaultProperties(objectType) {
      if (objectType === "contact") {
        return DEFAULT_CONTACT_PROPERTIES;
      } else if (objectType === "company") {
        return DEFAULT_COMPANY_PROPERTIES;
      } else if (objectType === "deal") {
        return DEFAULT_DEAL_PROPERTIES;
      } else if (objectType === "ticket") {
        return DEFAULT_TICKET_PROPERTIES;
      } else if (objectType === "product") {
        return DEFAULT_PRODUCT_PROPERTIES;
      } else if (objectType === "line_item") {
        return DEFAULT_LINE_ITEM_PROPERTIES;
      } else {
        return [];
      }
    },
  },
  async run({ $ }) {
    const objectType = this.getObjectType();
    const { additionalProperties = [] } = this;
    const defaultProperties = this.getDefaultProperties(this.getObjectType());

    const object = await this.hubspot.getObject(
      objectType,
      this.objectId,
      [
        ...defaultProperties,
        ...additionalProperties,
      ],
      $,
    );

    const objectName = this.hubspot.getObjectTypeName(objectType);
    $.export("$summary", `Successfully fetched ${objectName}`);

    return object;
  },
};
