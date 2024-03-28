import figma from "../figma.app.mjs";

export default {
  props: {
    figmaApp: {
      ...figma,
      reloadProps: true,
    },
  },
  methods: {
    getTeamId() {
      return this.figma.$auth.team_id ?? this.teamId;
    },
  },
  additionalProps() {
    const teamId = this.getTeamId();
    return teamId
      ? {}
      : {
        teamId: {
          propDefinition: [
            this.figma,
            "teamId",
          ],
        },
      };
  },
};
