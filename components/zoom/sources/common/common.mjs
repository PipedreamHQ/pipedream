import { ConfigurationError } from "@pipedream/platform";
import app from "../../zoom.app.mjs";

export default {
  props: {
    app,
    // eslint-disable-next-line pipedream/props-label, pipedream/props-description
    zoomApphook: {
      type: "$.interface.apphook",
      appProp: "zoom",
      eventNames() {
        return this.getEventNames();
      },
    },
  },
  methods: {
    getEventNames() {
      throw new ConfigurationError("You must implement the getEventNames() method");
    },
    sortByDate(objects, field) {
      return objects.sort((a, b) => (Date.parse(a[field]) > Date.parse(b[field]))
        ? 1
        : -1);
    },
    monthAgo() {
      const now = new Date();
      const monthAgo = new Date(now.getTime());
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      return monthAgo.toISOString().slice(0, 10);
    },
  },
  async run(event) {
    const { payload } = event;
    const { object } = payload;
    this.emitEvent(payload, object);
  },
};
