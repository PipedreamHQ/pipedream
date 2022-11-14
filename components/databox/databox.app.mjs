import Databox from 'databox'

export default {
  type: "app",
  app: "databox",
  propDefinitions: {
    metricKey: {
      label: "Metric Key",
      description: "The metric key",
      type: "string",
      async options() {
        const metrics = await this.getMetrics()

        return metrics.map(metric => ({
          label: metric.label,
          value: metric.key
        }))
      }
    }
  },
  methods: {
    _token() {
      return this.$auth.token
    },
    _client() {
      return new Databox({
        push_token: this._token()
      })
    },
    async getMetrics() {
      return await new Promise((resolve) => this._client().metrics((metrics) => resolve(metrics)))
    },
    async sendCustomData(args) {
      return this._client().send
    }
  },
};
