import mysqlSslApp from "../mysql_ssl.app.mjs";

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
    mysql,
    ...otherProps
  } = component.props;
  return {
    props: {
      mysql: mysqlSslApp,
      ...buildPropDefinitions({
        app: mysqlSslApp,
        props: otherProps,
      }),
    },
  };
}

export default {
  buildPropDefinitions,
  getAppProps,
};
