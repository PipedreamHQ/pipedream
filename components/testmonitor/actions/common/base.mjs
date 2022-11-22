import testmonitor from "../../testmonitor.app.mjs";

export default {
  props: {
    testmonitor,
    limit: {
      propDefinition: [
        testmonitor,
        "limit",
      ],
      optional: true,
    },
    page: {
      propDefinition: [
        testmonitor,
        "page",
      ],
      optional: true,
    },
    query: {
      propDefinition: [
        testmonitor,
        "query",
      ],
      optional: true,
    },
    order: {
      propDefinition: [
        testmonitor,
        "order",
      ],
      optional: true,
    },
    filter: {
      propDefinition: [
        testmonitor,
        "filter",
      ],
      optional: true,
    },
    withProp: {
      propDefinition: [
        testmonitor,
        "with",
      ],
      optional: true,
    },
  },
  methods: {
    async processEvent($) {
      const getFunc = this.getFunction();
      const {
        projectId,
        limit,
        page,
        query,
        order,
        filter,
        withProp,
      } = this;

      const params = {
        $,
        project_id: projectId,
        limit,
        page,
        query,
        with: withProp,
      };

      if (filter) {
        for (const [
          key,
          value,
        ] of Object.entries(filter)) {
          params[`filter[${key}]`] = value;
        }
      }

      if (order) {
        for (const [
          key,
          value,
        ] of Object.entries(order)) {
          params[`order[${key}]`] = value;
        }
      }

      return getFunc(params);
    },
  },
  async run({ $ }) {
    const response = await this.processEvent($);

    if (response.error) {
      throw new Error(response.error);
    }

    $.export("$summary", this.getSummary(response));
    return response;
  },
};
