import fibery from "../../fibery.app.mjs";

export default {
  props: {
    fibery,
    type: {
      propDefinition: [
        fibery,
        "type",
      ],
    },
    where: {
      propDefinition: [
        fibery,
        "where",
      ],
      optional: true,
    },
    params: {
      propDefinition: [
        fibery,
        "params",
      ],
      optional: true,
    },
    fields: {
      propDefinition: [
        fibery,
        "fields",
        (c) => ({
          type: c.type,
        }),
      ],
      optional: true,
    },
    attributes: {
      propDefinition: [
        fibery,
        "attributes",
      ],
    },
  },
  methods: {
    parseProps(fields, where, params) {
      return {
        fields: typeof (fields) === "string"
          ? JSON.parse(fields)
          : fields,
        where: typeof (where) === "string"
          ? JSON.parse(where)
          : where,
        params: typeof (params) === "string"
          ? JSON.parse(params)
          : params,
      };
    },
    async findEntities($) {
      const {
        fields,
        where,
        params,
      } = this.parseProps(this.fields, this.where, this.params);
      const { result: entities } = await this.fibery.listEntities({
        $,
        type: this.type,
        where,
        fields,
        params,
      });
      $.export("$summary", `Found ${entities.length} existing ${this.fibery.singularOrPluralEntity(entities)}`);
      return entities;
    },
    async createEntity($) {
      const response = await this.fibery.createEntity({
        $,
        type: this.type,
        attributes: this.attributes,
      });
      $.export("$summary", "Succesfully created a new entity");
      return response;
    },
    async updateEntities($, ids) {
      const response = await this.fibery.updateEntities({
        $,
        type: this.type,
        ids,
        attributes: this.attributes,
      });
      $.export("$summary", `Succesfully updated ${this.fibery.singularOrPluralEntity(ids)}`);
      return response;
    },
  },
};
