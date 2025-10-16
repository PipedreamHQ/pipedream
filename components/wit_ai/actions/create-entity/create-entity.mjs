import app from "../../wit_ai.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "wit_ai-create-entity",
  name: "Create Entity",
  description: "Creates a new entity with the given attributes. [See the documentation](https://wit.ai/docs/http/20240304/#post__entities_link)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    name: {
      type: "string",
      label: "Name",
      description: "Name for the entity. For built-in entities, use the `wit$` prefix.",
    },
    roles: {
      type: "string[]",
      label: "Roles",
      description: "List of roles you want to create for the entity. A default role will always be created",
      optional: true,
    },
    lookups: {
      type: "string[]",
      label: "Lookups",
      description: "For custom entities, list of lookup strategies (free-text, keywords). Both lookup strategies will be created if empty.",
      optional: true,
      options: [
        "free-text",
        "keywords",
      ],
    },
  },
  methods: {
    createEntity(args = {}) {
      return this.app.post({
        path: "/entities",
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      createEntity,
      name,
      roles,
      lookups,
    } = this;

    const response = await createEntity({
      $,
      data: {
        name,
        roles: utils.parseArray(roles),
        lookups: utils.parseArray(lookups),
      },
    });

    $.export("$summary", "Successfully created entity");

    return response;
  },
};
