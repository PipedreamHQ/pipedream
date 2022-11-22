import testmonitor from "../../testmonitor.app.mjs";

export default {
  props: {
    testmonitor,
    max: {
      propDefinition: [
        testmonitor,
        "max",
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
      const {
        projectId,
        max,
        query,
        order,
        filter,
        withProp,
      } = this;

      const params = {
        $,
        project_id: projectId,
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

      const items = this.testmonitor.paginate({
        fn: this.getFunction(),
        params,
        maxResults: max,
      });

      const results = [];
      for await (const item of items) {
        results.push(item);
      }
      return results;
    },
  },
  async run({ $ }) {
    const response = await this.processEvent($);

    $.export("$summary", this.getSummary(response));
    return response;
  },
};
