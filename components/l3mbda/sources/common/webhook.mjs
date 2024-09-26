import app from "../../l3mbda.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  props: {
    app,
    db: "$.service.db",
    http: "$.interface.http",
    from: {
      propDefinition: [
        app,
        "from",
      ],
    },
    to: {
      propDefinition: [
        app,
        "to",
      ],
    },
  },
  methods: {
    getEndpointId() {
      return this.db.get("endpointId");
    },
    setEndpointId(value) {
      this.db.set("endpointId", value);
    },
    createEndpoint(args = {}) {
      return this.app.post({
        path: "/endpoint",
        ...args,
      });
    },
    deleteEndpoint(args = {}) {
      return this.app.delete({
        path: "/endpoint",
        ...args,
      });
    },
    getEvent() {
      throw new ConfigurationError("getEvent() not implemented");
    },
    getSummary() {
      throw new ConfigurationError("getSummary() not implemented");
    },
    getFilters() {
      const filters = [];
      const {
        to,
        from,
      } = this;

      if (to) {
        filters.push({
          type: "to",
          value: to,
        });
      }

      if (from) {
        filters.push({
          type: "from",
          value: from,
        });
      }

      return filters;
    },
  },
  hooks: {
    async activate() {
      const {
        http,
        createEndpoint,
        getEvent,
        getFilters,
        setEndpointId,
      } = this;

      const response = await createEndpoint({
        data: {
          name: "Pipedream BLOCK",
          description: "Pipedream & L3mbda Integration",
          action: "webhook",
          url: http.endpoint,
          event: getEvent(),
          filters: getFilters(),
        },
      });

      setEndpointId(response.endpointId);
    },
    async deactivate() {
      const {
        deleteEndpoint,
        getEndpointId,
      } = this;

      const endpointId = getEndpointId();
      if (endpointId) {
        await deleteEndpoint({
          data: {
            endpointId,
          },
        });
      }
    },
  },
  run({ body }) {
    this.$emit(body, {
      id: body.hash,
      summary: this.getSummary(body),
      ts: body.timestamp,
    });
  },
};
