import keycloak from "../../keycloak.app.mjs";

export default {
  key: "keycloak-list-realm-options",
  name: "List Realm Options",
  description: "Retrieves available options for the Realm field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    keycloak,
  },
  async run({ $ }) {
    const options = await keycloak.propDefinitions.realm.options.call(this.keycloak);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
