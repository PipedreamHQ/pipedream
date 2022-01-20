import common from "../common.mjs";

export default {
  ...common,
  methods: {
    addParameter({
      src, validation, addition,
    }) {
      return validation
        ? {
          ...src,
          ...addition,
        }
        : src;
    },
    reduceParameters({
      initialParams = {}, additionalParams = {},
    }) {
      return Object.keys(additionalParams)
        .reduce((reducer, key) => {
          const [
            value,
            validation,
          ] = additionalParams[key];
          return this.addParameter({
            src: reducer,
            validation: validation,
            addition: {
              [key]: value,
            },
          });
        }, initialParams);
    },
  },
};
