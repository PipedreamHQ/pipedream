import sharepointAdmin from "../sharepoint_admin.app.mjs";

function buildPropDefinitions({
  app = {}, props = {},
}) {
  return Object.entries(props).reduce((newProps, [
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
    sharepoint: app,
    ...otherProps
  } = component.props;
  return {
    props: {
      sharepointAdmin,
      ...buildPropDefinitions({
        app: sharepointAdmin,
        props: otherProps,
      }),
    },
  };
}

export default {
  buildPropDefinitions,
  getAppProps,
};
