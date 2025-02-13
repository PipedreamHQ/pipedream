import a123formbuilder from "../../a123formbuilder.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  props: {
    a123formbuilder,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    listingFn() {
      throw new Error("listingFn not implemented");
    },
    getPage() {
      return this.db.get("page") || 1;
    },
    setPage(page) {
      this.db.set("page", page);
    },
    getEmittedIds() {
      return new Set(this.db.get("emittedIds") || []);
    },
    setEmittedIds(ids) {
      this.db.set("emittedIds", Array.from(ids));
    },
  },
  async run() {
    const page = this.getPage();
    const emittedIds = this.getEmittedIds();
    const response = await this.listingFn()({
      ...this.listingFnParams(),
      paginate: true,
      params: {
        page,
      },
    });
    this.setPage(this.a123formbuilder.getCurrentPage(response));
    response.data.forEach((form) => {
      if (!emittedIds.has(form.id)) {
        this.$emit(form, this.getMeta(form));
        emittedIds.add(form.id);
      }
    });
    this.setEmittedIds(emittedIds);
  },
};
