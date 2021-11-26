const crypto = require("crypto");
const difference = require("lodash/difference");
// eslint-disable-next-line camelcase
const zoom_admin = require("../../zoom_admin.app");

module.exports = {
  type: "source",
  name: "Changes to Webinar Panelists",
  key: "zoom_admin-webinar-changes-to-panelists",
  version: "0.0.1",
  description:
    "Emit new event every time a panelist is added or removed from a webinar, or any time their details change",
  dedupe: "unique",
  props: {
    zoom_admin,
    webinars: {
      propDefinition: [
        zoom_admin, // eslint-disable-line camelcase
        "webinars",
      ],
    },
    db: "$.service.db",
    // eslint-disable-next-line pipedream/props-label,pipedream/props-description
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
    generateMeta(eventType, panelist) {
      const {
        id: panelistID,
        email,
        name,
      } = panelist;
      const summary = name
        ? `${eventType} - ${name} - ${email}`
        : `${eventType} - ${email}`;
      return {
        id: `${panelistID}-${eventType}`,
        summary,
      };
    },
    hash(str) {
      return crypto.createHash("sha256").update(str)
        .digest("hex");
    },
    async fetchAndEmitParticipants() {
      // This endpoint allows for no time filter, so we fetch all participants from
      // all configured webinars and let the deduper handle duplicates
      const webinars = this.webinars || [];
      if (!this.webinars || !this.webinars.length) {
        let nextPageToken;
        do {
          const resp = await this.zoom_admin.listWebinars({
            nextPageToken,
          });
          for (const webinar of resp.webinars) {
            webinars.push(webinar.id);
          }
          nextPageToken = resp.next_page_token;
        } while (nextPageToken);
      }

      for (const webinarID of webinars) {
        const { panelists } = await this.zoom_admin.listWebinarPanelists(
          webinarID,
        );
        // We keep a DB key for each webinar, which contains an object
        // of panelists with the content of the panelist metadata,
        // to support change detection.
        const oldPanelists = this.db.get(webinarID) || {};
        const oldPanelistIDs = Object.keys(oldPanelists);
        const newPanelistIDs = panelists.map((p) => p.id);

        // DELETED PANELISTS
        const deletedPanelistIDs = difference(oldPanelistIDs, newPanelistIDs);

        let eventType = "panelist.deleted";
        for (const panelistID of deletedPanelistIDs) {
          const panelist = oldPanelists[panelistID];
          this.$emit(
            {
              eventType,
              ...panelist,
              webinarID,
            },
            this.generateMeta(eventType, panelist),
          );
        }

        // ADDED PANELISTS
        const addedPanelistIDs = difference(newPanelistIDs, oldPanelistIDs);

        const newPanelists = {};
        for (const panelist of panelists) {
          newPanelists[panelist.id] = panelist;
          if (addedPanelistIDs.includes(panelist.id)) {
            eventType = "panelist.added";
            this.$emit(
              {
                eventType,
                ...panelist,
                webinarID,
              },
              this.generateMeta(eventType, panelist),
            );
          }
          if (
            panelist.id in oldPanelists &&
            this.hash(JSON.stringify(panelist)) !==
              this.hash(JSON.stringify(oldPanelists[panelist.id]))
          ) {
            eventType = "panelist.changed";
            this.$emit(
              {
                eventType,
                ...panelist,
                webinarID,
              },
              this.generateMeta(eventType, panelist),
            );
          }
        }

        this.db.set(webinarID, newPanelists);
      }
    },
  },
  async run() {
    await this.fetchAndEmitParticipants();
  },
};
