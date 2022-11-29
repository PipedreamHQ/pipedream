import app from "../slack_bot.app.mjs";

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

function getPropsOnly({
  component, omitProps = [], appLabel,
} = {}) {
  const {
    // eslint-disable-next-line no-unused-vars
    [appLabel]: appProp,
    ...props
  } = component.props;
  return Object.entries(props)
    .reduce((reduction, [
      key,
      value,
    ]) => {
      if (omitProps.includes(key)) {
        return reduction;
      }
      return {
        ...reduction,
        [key]: value,
      };
    }, {});
}

function buildAppProps({
  component, omitProps = [], appLabel = "slack",
} = {}) {
  return {
    [appLabel]: app,
    ...buildPropDefinitions({
      app,
      props: getPropsOnly({
        component,
        omitProps,
        appLabel,
      }),
    }),
  };
}

export default {
  buildAppProps,
};
