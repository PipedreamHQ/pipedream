import app from "../procore_sandbox.app.mjs";

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

function getAppProps(component = {}) {
  const {
    // eslint-disable-next-line no-unused-vars
    app: procore,
    ...otherProps
  } = component.props;
  return {
    props: {
      app,
      ...buildPropDefinitions({
        app,
        props: otherProps,
      }),
    },
  };
}

export default {
  buildPropDefinitions,
  getAppProps,
};
