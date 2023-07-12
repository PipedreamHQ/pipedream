import github from "../../github.app.mjs";

export default {
  key: "github-new-or-updated-pull-request",
  name: "New or Updated Pull Request",
  description: "Emit new events when a pull request is opened or updated",
  version: "1.0.0",
  type: "source",
  dedupe: "unique",
  props: {
    github,
    repoFullname: {
      propDefinition: [
        github,
        "repoFullname",
      ],
      reloadProps: true,
    },
    db: "$.service.db",
    http: "$.interface.http",
  },
  async additionalProps() {
    const { repoFullname } = this;
    const { login: username } = await this.github.getAuthenticatedUser();
    const { user: { permissions } } = await this.github.getUserRepoPermissions({
      repoFullname,
      username,
    });

    return {
      testProp1: {
        type: "string",
        label: "Test Prop 1",
        optional: true,
        default: JSON.stringify(permissions),
      },
    };
  },
  hooks: {
    async deploy() {
      console.log(Date.now());
    },
    async activate() {
      console.log(Date.now());
    },
    async deactivate() {
      console.log(Date.now());
    },
  },
  async run() {
    this.$emit({
      test1: this.testProp1,
    }, {
      id: Date.now(),
      summary: "Test " + Date.now(),
      ts: Date.now(),
    });
  },
};
