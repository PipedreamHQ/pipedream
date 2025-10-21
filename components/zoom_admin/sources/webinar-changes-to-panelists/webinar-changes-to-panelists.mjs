import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import crypto from "crypto";
import difference from "lodash/difference.js";
import { sanitizedArray } from "../../utils.mjs";
import zoomAdmin from "../../zoom_admin.app.mjs";

export default {
  type: "source",
  name: "Changes to Webinar Panelists",
  key: "zoom_admin-webinar-changes-to-panelists",
  version: "0.1.8",
  description: "Emit new event every time a panelist is added or removed from a webinar, or any time their details change",
  dedupe: "unique",
  props: {
    zoomAdmin,
    webinars: {
      propDefinition: [
        zoomAdmin,
        "webinar",
      ],
      type: "string[]",
      description: "Webinars you want to watch for new events. **Leave blank to watch all webinars**.",
    },
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
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
      const webinars = sanitizedArray(this.webinars || []);
      if (!this.webinars || !this.webinars.length) {
        let nextPageToken;
        do {
          const resp = await this.zoomAdmin.listWebinars(null, nextPageToken);
          for (const webinar of resp.webinars) {
            webinars.push(webinar.id);
          }
          nextPageToken = resp.next_page_token;
        } while (nextPageToken);
      }

      for (const webinarID of webinars) {
        const { panelists } = await this.zoomAdmin.listWebinarPanelists(
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
