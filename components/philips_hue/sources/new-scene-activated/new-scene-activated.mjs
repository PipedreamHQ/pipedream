import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "philips_hue-new-scene-activated",
  name: "New Scene Activated",
  description: "Emit new event when a specific scene is activated. [See the documentation](https://developers.meethue.com/develop/hue-api-v2/api-reference/#resource_light__id__put)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    sceneId: {
      propDefinition: [
        common.props.philipsHue,
        "sceneId",
        (c) => ({
          username: c.username,
        }),
      ],
    },
  },
  methods: {
    ...common.methods,
    getSummary(item) {
      return `Scene Activated with ID: ${item.id}`;
    },
  },
  async run() {
    const previousData = this._getPreviousData();

    const { data } = await this.philipsHue.getScene({
      username: this.username,
      sceneId: this.sceneId,
    });

    for (const item of data) {
      const state = item.status.active;
      if (previousData[item.id] && previousData[item.id] === state) {
        continue;
      }

      if (state === "static") {
        this.emitEvent(item);
      }

      previousData[item.id] = state;
    }

    this._setPreviousData(previousData);
  },
  sampleEmit,
};
