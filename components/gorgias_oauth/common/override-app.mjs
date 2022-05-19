import app from "../gorgias_oauth.app.mjs";
const appName = "gorgias";

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
