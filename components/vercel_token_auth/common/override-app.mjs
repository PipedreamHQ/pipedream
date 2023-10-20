import app from "../vercel_token_auth.app.mjs";
const appName = "vercel";

/**
 * This function substitutes the app so that $auth and propDefinitions correspond to the correct app
 * This is done to avoid duplicating code because all component props and methods are shared between
 * gorgias_oauth and gorgias (api_key) apps
 * @param {*} base app to inject - in this case, gorgias_oauth
 */
function overrideApp(base) {
  base.props[appName] = app;

  Object.keys(base.props)
    .filter((prop) => prop != appName)
    .forEach((prop) => {
      const { propDefinition } = base.props[prop];
      if (propDefinition?.length > 0) {
        propDefinition[0] = app;
      }
    });
}

export default overrideApp;
