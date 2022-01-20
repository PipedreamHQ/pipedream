import microsoftTeams from "./microsoft_teams.app.mjs";

export default {
  props: {
    microsoftTeams,
    commonProperty: {
      propDefinition: [
        microsoftTeams,
        "commonProperty",
      ],
    },
  },
};
