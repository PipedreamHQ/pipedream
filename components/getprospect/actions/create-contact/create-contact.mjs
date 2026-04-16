import getprospect from "../../getprospect.app.mjs";
import { parseObject } from "../../common/utils.mjs";

export default {
  key: "getprospect-create-contact",
  name: "Create Contact",
  description: "Create a new contact in GetProspect. [See the documentation](https://getprospect.readme.io/reference/contactcontroller_create)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    getprospect,
    method: {
      type: "string",
      label: "Method",
      description: "Whether to enter properties as key-value pairs or as individual fields",
      options: [
        "fields",
        "object",
      ],
      reloadProps: true,
    },
    listIds: {
      propDefinition: [
        getprospect,
        "listIds",
      ],
      optional: true,
    },
  },
  async additionalProps() {
    const props = {};
    if (this.method === "fields") {
      const propertyTypes = await this.getprospect.listProperties();
      for (const property of propertyTypes) {
        props[property._id] = {
          type: property.fieldType === "number"
            ? "integer"
            : "string",
          label: property.name,
          description: property.description,
          optional: !property.required,
          options: property.options?.length
            ? property.options.map((option) => option?.value || option)
            : undefined,
        };
      }
    } else {
      props.properties = {
        type: "object",
        label: "Properties",
        description: "A key-value collection of properties to add to the contact",
      };
    }
    return props;
  },
  methods: {
    async buildPropertiesFromFields() {
      const propertyTypes = await this.getprospect.listProperties();
      const properties = [];
      for (const property of propertyTypes) {
        if (this[property._id]) {
          properties.push({
            property: property.name,
            value: this[property._id],
          });
        }
      }
      return properties;
    },
    async buildPropertiesFromObject() {
      const properties = [];
      for (const [
        key,
        value,
      ] of Object.entries(parseObject(this.properties))) {
        properties.push({
          property: key,
          value: value,
        });
      }
      return properties;
    },
  },
  async run({ $ }) {
    const response = await this.getprospect.createContact({
      $,
      data: {
        listRelations: this.listIds,
        properties: this.method === "fields"
          ? await this.buildPropertiesFromFields()
          : await this.buildPropertiesFromObject(),
      },
    });
    if (response.data?._id) {
      $.export("$summary", `Successfully created contact with ID: ${response.data?._id}`);
    }
    return response;
  },
};
