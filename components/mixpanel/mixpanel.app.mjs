// x-pd-ai: optimized
import Mixpanel from "mixpanel";

export default {
  type: "app",
  app: "mixpanel",
  propDefinitions: {},
  methods: {
    _client() {
      return Mixpanel.init(this.$auth.token, {
        protocol: "https",
      });
    },
    trackEvent({
      event, properties,
    }) {
      return new Promise((resolve, reject) => this._client().track(
        event,
        {
          ...properties,
        },
        (error) => error
          ? reject(error)
          : resolve(),
      ));
    },
  },
};
