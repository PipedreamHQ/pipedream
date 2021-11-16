export default {
  methods: {
    addProperty({
      src, validation, addition,
    }) {
      return validation
        ? {
          ...src,
          ...addition,
        }
        : src;
    },
    reduceProperties({
      initialProps = {}, additionalProps = {},
    }) {
      return Object.keys(additionalProps)
        .reduce((reducer, key) => {
          const [
            value,
            validation,
          ] = additionalProps[key];
          return this.addProperty({
            src: reducer,
            validation: validation,
            addition: {
              [key]: value,
            },
          });
        }, initialProps);
    },
  },
};
