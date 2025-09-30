import ironclad from "../../ironclad.app.mjs";

export default {
  key: "ironclad-create-record",
  name: "Create Record",
  description: "Creates a new record in Ironclad. [See the documentation](https://developer.ironcladapp.com/reference/create-a-record)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    ironclad,
    name: {
      type: "string",
      label: "Name",
      description: "Name of the record",
    },
    type: {
      propDefinition: [
        ironclad,
        "recordType",
      ],
    },
    links: {
      propDefinition: [
        ironclad,
        "recordId",
      ],
      type: "string[]",
      label: "Links",
      description: "Record ID's to link to the new record",
    },
    parent: {
      propDefinition: [
        ironclad,
        "recordId",
      ],
      label: "Parent",
      description: "Record ID to be set as the parent of the current record",
    },
    children: {
      propDefinition: [
        ironclad,
        "recordId",
      ],
      type: "string[]",
      label: "Children",
      description: "Record ID's to be set as child records of the current record",
    },
    properties: {
      propDefinition: [
        ironclad,
        "properties",
      ],
      reloadProps: true,
    },
  },
  async additionalProps() {
    const props = {};
    if (!this.properties?.length) {
      return props;
    }
    const { properties } = await this.ironclad.getRecordsSchema();
    for (const property of this.properties) {
      props[property] = {
        type: properties[property].type === "boolean"
          ? "boolean"
          : "string",
        label: properties[property].displayName,
        description: properties[property].description ?? `Value of ${properties[property].displayName}`,
      };
    }
    return props;
  },
  async run({ $ }) {
    const { properties } = await this.ironclad.getRecordsSchema();
    const propertiesData = {};
    for (const property of this.properties) {
      propertiesData[property] = {
        type: properties[property].type,
        value: this[property],
      };
    }

    const response = await this.ironclad.createRecord({
      $,
      data: {
        name: this.name,
        type: this.type,
        links: this.links?.length && this.links.map((link) => ({
          recordId: link,
        })),
        parent: this.parent && {
          recordId: this.parent,
        },
        children: this.children?.length && this.children.map((child) => ({
          recordId: child,
        })),
        properties: propertiesData,
      },
    });
    $.export("$summary", `Created record with ID: ${response.id}`);
    return response;
  },
};
