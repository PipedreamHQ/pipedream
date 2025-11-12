import attio from "../../attio.app.mjs";
import constants from "../../common/constants.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "attio-create-update-record",
  name: "Create or Update Record",
  description: "Creates or updates a specific record such as a person or a deal. If the record already exists, it's updated. Otherwise, a new record is created. [See the documentation](https://developers.attio.com/reference/put_v2-objects-object-records)",
  version: "0.0.7",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    attio,
    objectId: {
      reloadProps: true,
      propDefinition: [
        attio,
        "objectId",
        () => ({
          filter: (o) => o.api_slug !== constants.TARGET_OBJECT.DEALS,
        }),
      ],
    },
    matchingAttribute: {
      reloadProps: true,
      propDefinition: [
        attio,
        "matchingAttribute",
        (c) => ({
          objectId: c.objectId,
        }),
      ],
    },
  },
  async additionalProps() {
    const props = {};
    if (!this.matchingAttribute) {
      return props;
    }
    const attributes = await this.getRelevantAttributes();

    const matchingAttribute = attributes.find(
      (a) => a.api_slug === this.matchingAttribute,
    );
    if (matchingAttribute) {
      attributes.splice(attributes.indexOf(matchingAttribute), 1);
      attributes.unshift(matchingAttribute);
    }

    for (const attribute of attributes) {
      props[attribute.api_slug] = {
        type: attribute.is_multiselect
          ? "string[]"
          : "string",
        label: attribute.title,
        optional: !attribute.is_required,
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

      return attributes
        .filter((a) => a.is_writable)
        .sort((a, b) => b.is_required - a.is_required);
    },
  },
  async run({ $ }) {
    const {
      attio,
      objectId,
      matchingAttribute,
      ...values
    } = this;

    const response = await attio.upsertRecord({
      $,
      objectId,
      params: {
        matching_attribute: matchingAttribute,
      },
      data: {
        data: {
          values,
        },
      },
    });
    $.export("$summary", "Successfully created or updated record");
    return response;
  },
};
