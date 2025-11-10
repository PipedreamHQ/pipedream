import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import googleDrive from "../../google_drive.app.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  key: "google_drive-new-access-proposal",
  name: "New Access Proposal",
  description: "Emit new event when a new access proposal is requested in Google Drive",
  version: "0.0.7",
  type: "source",
  dedupe: "unique",
  props: {
    googleDrive,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    drive: {
      propDefinition: [
        googleDrive,
        "watchedDrive",
      ],
    },
    fileOrFolderId: {
      propDefinition: [
        googleDrive,
        "fileOrFolderId",
        (c) => ({
          drive: c.drive,
        }),
      ],
    },
  },
  methods: {
    _getLastTs() {
      return this.db.get("lastTs") || 0;
    },
    _setLastTs(lastTs) {
      this.db.set("lastTs", lastTs);
    },
    generateMeta(item) {
      return {
        id: item.proposalId,
        summary: `New Request From: ${item.requesterEmailAddress}`,
        ts: Date.parse(item.createTime),
      };
    },
  },
  async run() {
    const lastTs = this._getLastTs();
    let maxTs = lastTs;
    let pageToken;

    do {
      const {
        accessProposals, nextPageToken,
      } = await this.googleDrive.listAccessProposals({
        fileId: this.fileOrFolderId,
        pageToken,
      });
      if (!accessProposals) {
        break;
      }
      for (const proposal of accessProposals) {
        const ts = Date.parse(proposal.createTime);
        if (ts > lastTs) {
          const meta = this.generateMeta(proposal);
          this.$emit(proposal, meta);
          maxTs = Math.max(ts, maxTs);
        }
      }
      pageToken = nextPageToken;
    } while (pageToken);

    this._setLastTs(maxTs);
  },
  sampleEmit,
};
