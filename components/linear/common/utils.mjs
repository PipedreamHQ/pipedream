function buildPropDefinitions({
  app = {}, props = {},
}) {
  return Object.entries(props)
    .reduce((newProps, [
      key,
      prop,
    ]) => {
      if (!prop.propDefinition) {
        return {
          ...newProps,
          [key]: prop,
        };
      }

      const [
        , ...propDefinitionItems
      ] = prop.propDefinition;

      return {
        ...newProps,
        [key]: {
          ...prop,
          propDefinition: [
            app,
            ...propDefinitionItems,
          ],
        },
      };
    }, {});
}

export default {
  buildPropDefinitions,
};
