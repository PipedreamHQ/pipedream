import hubspot from "../../hubspot.app.mjs";
import {
  DEFAULT_CONTACT_PROPERTIES,
  DEFAULT_COMPANY_PROPERTIES,
  DEFAULT_DEAL_PROPERTIES,
  DEFAULT_TICKET_PROPERTIES,
  DEFAULT_PRODUCT_PROPERTIES,
  DEFAULT_LINE_ITEM_PROPERTIES,
  DEFAULT_MEETING_PROPERTIES,
  OBJECT_TYPE,
} from "../../common/constants.mjs";

export default {
  props: {
    hubspot,
    objectId: {
      type: "string",
      label: "Object ID",
      description: "Hubspot's internal ID for the object",
      useQuery: true,
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
      if (objectType === OBJECT_TYPE.CONTACT) {
        return DEFAULT_CONTACT_PROPERTIES;
      } else if (objectType === OBJECT_TYPE.COMPANY) {
        return DEFAULT_COMPANY_PROPERTIES;
      } else if (objectType === OBJECT_TYPE.DEAL) {
        return DEFAULT_DEAL_PROPERTIES;
      } else if (objectType === OBJECT_TYPE.TICKET) {
        return DEFAULT_TICKET_PROPERTIES;
      } else if (objectType === OBJECT_TYPE.PRODUCT) {
        return DEFAULT_PRODUCT_PROPERTIES;
      } else if (objectType === OBJECT_TYPE.LINE_ITEM) {
        return DEFAULT_LINE_ITEM_PROPERTIES;
      } else if (objectType === OBJECT_TYPE.MEETING) {
        return DEFAULT_MEETING_PROPERTIES;
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
