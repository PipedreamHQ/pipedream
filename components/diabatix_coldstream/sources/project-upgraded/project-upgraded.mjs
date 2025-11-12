import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import _ from "lodash";
import coldstream from "../../diabatix_coldstream.app.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  key: "diabatix_coldstream-project-upgraded",
  name: "New Project Upgraded",
  description: "Emit new event when a specific project has been upgraded or edited in ColdStream.",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  props: {
    coldstream,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    organizationId: {
      propDefinition: [
        coldstream,
        "organizationId",
      ],
    },
    projectId: {
      propDefinition: [
        coldstream,
        "projectId",
        ({ organizationId }) => ({
          organizationId,
        }),
      ],
    },
  },
  methods: {
    _getLastObject() {
      return this.db.get("lastObject");
    },
    _setLastObject(lastObject = null) {
      this.db.set("lastObject", this._parsePictureUrl(lastObject));
    },
    _parsePictureUrl(obj) {
      const regex = /(http.+)\?/g;
      const newPictureUrl = regex.exec(obj.pictureUrl);
      return {
        ...obj,
        pictureUrl: newPictureUrl[0],
      };
    },
    async startEvent() {
      const lastObject = this._getLastObject();
      const currentProjectData = await this.coldstream.getProject({
        projectId: this.projectId,
      });
      if ((!lastObject) ||
      (lastObject && (!_.isEqual(this._parsePictureUrl(currentProjectData), lastObject)))) {
        this.$emit(currentProjectData, this.generateMeta(currentProjectData));
        this._setLastObject(currentProjectData);
      }
    },
    generateMeta(data) {
      const ts = new Date();
      return {
        id: `${data.id}-${ts}`,
        summary: `Project ${data.name} updated.`,
        ts: Date.parse(ts),
      };
    },
  },
  hooks: {
    async deploy() {
      await this.startEvent();
    },
  },
  async run() {
    await this.startEvent();
  },
  sampleEmit,
};
