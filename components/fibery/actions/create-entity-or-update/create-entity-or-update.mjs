import common from "../common/common-entities.mjs";

delete common.props.fields;

export default {
  ...common,
  key: "fibery-create-entity-or-update",
  name: "Create or Update Entity",
  description: "Creates a new entity or updates if it exists. [See the docs here](https://api.fibery.io/graphql.html#update)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    ...common.props,
    updateAll: {
      type: "boolean",
      label: "Update All",
      description: "If `true`, all entities that match the filter will be updated. If `false`, only the first entity will be updated",
      optional: true,
    },
  },
  async run({ $ }) {
    const entities = await this.findEntities($);

    let ids = entities.map((entity) => entity["fibery/id"]);

    if (ids.length === 0) {
      return this.createEntity($);
    }

    if (!this.updateAll) {
      ids = ids.slice(0, 1);
    }

    return this.updateEntities($, ids);
  },
};
