import common from "../common/common-polling.mjs";

export default {
  ...common,
  key: "github-new-star-by-user",
  name: "New Star By User",
  description: "Emit new events when the specified user stars a repository",
  version: "0.0.4",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    user: {
      type: "string",
      label: "Username",
      description: "A GitHub username to watch for new stars. Defaults to the authenticated user if not specified.",
      optional: true,
    },
  },
  methods: {
    ...common.methods,
    async getUserStars(user) {
      const response = await this.github._client().request(`GET /users/${user}/starred`);
      return response.data;
    },
  },
  async run() {
    const user = this.user ?? (await this.github.getAuthenticatedUser()).login;
    const stars = await this.getUserStars(user);

    stars?.forEach((star) => {
      this.$emit(star, {
        id: star.id,
        summary: `New star: ${star.full_name}`,
        ts: Date.now(),
      });
    });
  },
};
