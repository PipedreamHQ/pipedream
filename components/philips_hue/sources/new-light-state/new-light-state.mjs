import common from "../common/base.mjs";
import { ConfigurationError } from "@pipedream/platform";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "philips_hue-new-light-state",
  name: "New Light State",
  description: "Emit new event when the state of a light changes (e.g., turned on/off, brightness adjusted, color changed). [See the documentation](https://developers.meethue.com/develop/hue-api-v2/api-reference/#resource_light__id__put)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    lightId: {
      propDefinition: [
        common.props.philipsHue,
        "lightId",
        (c) => ({
          username: c.username,
        }),
      ],
      optional: true,
    },
    groupId: {
      propDefinition: [
        common.props.philipsHue,
        "groupId",
        (c) => ({
          username: c.username,
        }),
      ],
      optional: true,
    },
  },
  hooks: {
    deploy() {
      if ((!this.lightId && !this.groupId) || (this.lightId && this.groupId)) {
        throw new ConfigurationError("Must specify exactly one of Light ID or Group ID");
      }
    },
  },
  methods: {
    ...common.methods,
    getSummary(item) {
      return `${this.lightId
        ? "Light"
        : "Group"} with ID ${item.id} changed ${item.propertyChanged} state`;
    },
  },
  async run() {
    const previousData = this._getPreviousData();
    const args = {
      username: this.username,
    };
    const { data } = this.lightId
      ? await this.philipsHue.getLight({
        ...args,
        lightId: this.lightId,
      })
      : await this.philipsHue.getGroup({
        ...args,
        groupId: this.groupId,
      });

    for (const item of data) {
      const itemData = {
        on: item?.on,
        brightness: item?.dimming?.brightness,
        color: item?.color?.xy,
      };
      if (
        previousData[item.id]
        && JSON.stringify(previousData[item.id]) === JSON.stringify(itemData)
      ) {
        continue;
      }
      item.propertyChanged = !previousData[item.id] || previousData[item.id].on !== itemData.on
        ? "on/off"
        : previousData[item.id].brightness !== itemData.brightness
          ? "brightness"
          : "color";

      this.emitEvent(item);

      previousData[item.id] = itemData;
    }

    this._setPreviousData(previousData);
  },
  sampleEmit,
};
