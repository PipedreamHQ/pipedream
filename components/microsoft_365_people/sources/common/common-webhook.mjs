import microsoftOutlook from "../../microsoft_365_people.app.mjs";
import common from "../../../microsoft_outlook/sources/common/common.mjs";

export default {
  ...common,
  props: {
    ...common.props,
    microsoftOutlook,
  },
  methods: {
    ...common.methods,
    emitEvent(item) {
      this.$emit(item, this.generateMeta(item));
    },
  },
};
