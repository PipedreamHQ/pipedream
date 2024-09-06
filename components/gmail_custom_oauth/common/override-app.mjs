import app from "../gmail_custom_oauth.app.mjs";
const appName = "gmail";

/**
 * This function substitutes the app so that $auth and propDefinitions correspond to the correct app
 * This is done to avoid duplicating code because all component props and methods are shared between
 * gmail_custom_oauth and gmail apps
 * @param {*} base app to inject - in this case, gmail_custom_oauth
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
