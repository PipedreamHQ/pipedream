import appProp from "./common-app-prop.mjs";

export default {
  props: {
    ...appProp.props,
  },
  methods: {
    getObjectType() {
      throw new Error("getObjectType is not implemented");
    },
  },
};
