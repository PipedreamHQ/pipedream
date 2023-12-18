export default {
  type: "source",
  key: "linkly-new-link-clicked",
  name: "New Link Clicked",
  description: "Emit new event when a Linkly link is clicked",
  version: "0.0.{{ts}}",
  dedupe: "unique",
  props: {
    linkly: {
      type: "app",
      app: "linkly",
    },
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60,
      },
    },
    linkId: {
      type: "string",
      label: "Link ID",
      description: "The ID of the Linkly link",
      required: true,
    },
  },
  methods: {
    _getClicks() {
      return this.db.get("clicks") ?? [];
    },
    _setClicks(clicks) {
      this.db.set("clicks", clicks);
    },
  },
  async run() {
    const { data: newClicks } = await this.linkly.getLink({
      linkId: this.linkId,
    });
    const oldClicks = this._getClicks();

    for (const click of newClicks) {
      if (!oldClicks.includes(click.id)) {
        this.$emit(click, {
          id: click.id,
          summary: `New Click: ${click.title}`,
          ts: Date.parse(click.created_at),
        });
      }
    }
    this._setClicks(newClicks.map((click) => click.id));
  },
};
