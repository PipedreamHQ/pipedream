import attio from "../../attio.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "attio-create-update-record",
  name: "Create or Update Record",
  description: "Creates or updates a specific record such as a person or a deal. If the record already exists, it's updated. Otherwise, a new record is created. [See the documentation](https://developers.attio.com/reference/put_v2-objects-object-records)",
  version: "0.0.2",
  type: "action",
  props: {
    attio,
    objectId: {
      propDefinition: [
        attio,
        "objectId",
      ],
    },
    attributeId: {
      propDefinition: [
        attio,
        "attributeId",
        (c) => ({
          objectId: c.objectId,
        }),
      ],
      reloadProps: true,
    },
  },
  async additionalProps() {
    const props = {};
    if (!this.attributeId) {
      return props;
    }
    const attributes = await this.getRelevantAttributes();
    for (const attribute of attributes) {
      props[attribute.id.attribute_id] = {
        type: attribute.is_multiselect
          ? "string[]"
          : "string",
        label: attribute.title,
        optional: attribute.id.attribute_id !== this.attributeId && !attribute.is_required,
      };
    }
    return props;
  },
  methods: {
    async getRelevantAttributes() {
      const stream = utils.paginate({
        fn: this.attio.listAttributes,
        args: {
          objectId: this.objectId,
        },
      });
      const attributes = await utils.streamIterator(stream);
      return attributes.filter((a) => a.is_writable || a.id.attribute_id === this.attributeId);
    },
  },
  async run({ $ }) {
    const {
      attio,
      getRelevantAttributes,
      objectId,
      attributeId,
      ...values
    } = this;

    const attributes = await getRelevantAttributes();

    const response = await attio.upsertRecord({
      $,
      objectId,
      params: {
        matching_attribute: attributeId,
      },
      data: {
        data: {
          values: utils.parseValues(attributes, values),
        },
      },
    });
    $.export("$summary", "Successfully created or updated record");
    return response;
  },
};
