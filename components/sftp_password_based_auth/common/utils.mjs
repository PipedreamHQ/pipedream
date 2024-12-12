import app from "../sftp_password_based_auth.app.mjs";

function buildPropDefinitions({
  app = {}, props = {},
}) {
  return Object.entries(props)
    .reduce((newProps, [
      key,
      prop,
    ]) => {
      if (!prop.propDefinition) {
        return Object.assign(newProps, {
          [key]: prop,
        });
      }

      const [
        , ...propDefinitionItems
      ] = prop.propDefinition;

      return Object.assign(newProps, {
        [key]: Object.assign(prop, {
          propDefinition: [
            app,
            ...propDefinitionItems,
          ],
        }),
      });
    }, {});
}

function getPropsOnly({
  component, omitProps = [], appLabel, addedProps = {},
} = {}) {
  const {
    // eslint-disable-next-line no-unused-vars
    [appLabel]: appProp,
    ...props
  } = component.props;
  const builtProps = Object.entries(props)
    .reduce((reduction, [
      key,
      value,
    ]) => {
      if (omitProps.includes(key)) {
        return reduction;
      }
      return Object.assign(reduction, {
        [key]: value,
      });
    }, {});
  return {
    ...builtProps,
    ...addedProps,
  };
}

function buildAppProps({
  component, omitProps = [], appLabel = "app", addedProps,
} = {}) {
  return {
    [appLabel]: app,
    ...buildPropDefinitions({
      app,
      props: getPropsOnly({
        component,
        omitProps,
        appLabel,
        addedProps,
      }),
    }),
  };
}

export default {
  buildPropDefinitions,
  getPropsOnly,
  buildAppProps,
};
