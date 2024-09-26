import app from "../slack_bot.app.mjs";

const CONVERSATION_PERMISSION_MESSAGE = "In order to list a Slack channel, **your bot must be a member of that channel**, and in order to list private channels, your bot must have the `groups:read` scope in the `OAuth & Permissions` settings in Slack for this bot.";

async function streamIterator(stream) {
  let resources = [];
  for await (const resource of stream) {
    resources.push(resource);
  }
  return resources;
}

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

      if (key === "conversation") {
        prop.description = prop.description
          ? `${prop.description} ${CONVERSATION_PERMISSION_MESSAGE}`
          : `Select a public or private channel, or a user or group. ${CONVERSATION_PERMISSION_MESSAGE}`;
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
      return {
        ...reduction,
        [key]: value,
      };
    }, {});
  return {
    ...builtProps,
    ...addedProps,
  };
}

function buildAppProps({
  component, omitProps = [], appLabel = "slack", addedProps,
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
  streamIterator,
  buildAppProps,
  CONVERSATION_PERMISSION_MESSAGE,
};
