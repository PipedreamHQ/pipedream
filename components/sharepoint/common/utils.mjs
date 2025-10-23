export default {
  cleanObject(o) {
    for (var k in o || {}) {
      if (typeof o[k] === "undefined") {
        delete o[k];
      }
    }
    return o;
  },
  adjustPropDefinitions(props, app) {
    return Object.fromEntries(
      Object.entries(props).map(([
        key,
        prop,
      ]) => {
        if (typeof prop === "string") return [
          key,
          prop,
        ];
        const {
          propDefinition, ...otherValues
        } = prop;
        if (propDefinition) {
          const [
            , ...otherDefs
          ] = propDefinition;
          return [
            key,
            {
              propDefinition: [
                app,
                ...otherDefs,
              ],
              ...otherValues,
            },
          ];
        }
        return [
          key,
          otherValues.type === "app"
            ? null
            : otherValues,
        ];
      })
        .filter(([
          , value,
        ]) => value),
    );
  },
};
