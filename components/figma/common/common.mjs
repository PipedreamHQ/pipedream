import figma from "../figma.app.mjs";

export default {
  props: {
    figmaApp: {
      ...figma,
    },
  },
  methods: {
    getTeamId() {
      return this.figmaApp._getTeamId() ?? this.teamId;
    },
  },
  additionalProps() {
    const teamId = this.getTeamId();
    return teamId
      ? {}
      : {
        teamId: {
          propDefinition: [
            figma,
            "teamId",
          ],
        },
      };
  },
};
