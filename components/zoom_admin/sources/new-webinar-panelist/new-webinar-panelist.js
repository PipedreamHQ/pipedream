const zoom_admin = require("../../zoom_admin.app");

module.exports = {
  name: "New Panelists for Webinar",
  key: "zoom-admin-new-webinar-panelists",
  version: "0.0.2",
  description: "Emits an event every time a new panelist is added to a webinar",
  dedupe: "unique",
  props: {
    zoom_admin,
    webinars: { propDefinition: [zoom_admin, "webinars"] },
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15,
      },
    },
  },
  hooks: {
    async deploy() {
      // Fetch and emit sample events
      await this.fetchAndEmitParticipants();
    },
  },
  methods: {
    generateMeta(panelist) {
      const { id, email, name } = panelist;
      const summary = name ? `${name} - ${email}` : email;
      return {
        id,
        summary,
      };
    },
    async fetchAndEmitParticipants() {
      // This endpoint allows for no time filter, so we fetch all participants from
      // all configured webinars and let the deduper handle duplicates
      for (webinarID of this.webinars) {
        const { panelists } = await this.zoom_admin.listWebinarPanelists(
          webinarID
        );
        for (const panelist of panelists) {
          this.$emit({ ...panelist, webinarID }, this.generateMeta(panelist));
        }
      }
    },
  },
  async run(event) {
    await this.fetchAndEmitParticipants();
  },
};
