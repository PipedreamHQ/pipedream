import zoom from "../../zoom.app.mjs";

export default {
  props: {
    zoom,
  },
  methods: {
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
