import microsoftOutlook from "../../microsofttodo.app.mjs";
import common from "../../../microsoft_outlook/sources/common.mjs";

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
