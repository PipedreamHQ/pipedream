import terraform from "../../terraform.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  key: "terraform-new-run-created",
  name: "New Run Createe",
  description: "Emit new event when a new run is created in Terraform.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    terraform,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    orgId: {
      propDefinition: [
        terraform,
        "orgId",
      ],
    },
    workspaceId: {
      propDefinition: [
        terraform,
        "workspaceId",
        (c) => ({
          orgId: c.orgId,
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
    generateMeta(run) {
      return {
        id: run.id,
        summary: `New Run ${run.id}`,
        ts: Date.parse(run.attributes["created-at"]),
      };
    },
  },
  async run() {
    const lastTs = this._getLastTs();
    let maxTs = lastTs;

    const runs = this.terraform.paginate({
      resourceFn: this.terraform.listRuns,
      args: {
        workspaceId: this.workspaceId,
      },
    });

    for await (const run of runs) {
      const ts = Date.parse(run.attributes["created-at"]);
      if (ts > lastTs) {
        const meta = this.generateMeta(run);
        this.$emit(run, meta);
        if (ts > maxTs) {
          maxTs = ts;
        }
      }
    }

    this._setLastTs(maxTs);
  },
};
