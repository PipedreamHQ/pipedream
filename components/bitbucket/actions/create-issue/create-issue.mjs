// legacy_hash_id: a_OOiaQ0
import { axios } from "@pipedream/platform";

export default {
  key: "bitbucket-create-issue",
  name: "Creates a new issue",
  description: "Creates a new issue",
  version: "0.1.1",
  type: "action",
  props: {
    bitbucket: {
      type: "app",
      app: "bitbucket",
    },
    username: {
      type: "string",
      label: "username",
    },
    repo_slug: {
      type: "string",
      label: "repo_slug",
    },
    priority: {
      type: "string",
      optional: true,
    },
    kind: {
      type: "string",
      optional: true,
    },
    repository: {
      type: "object",
      optional: true,
    },
    links: {
      type: "object",
      optional: true,
    },
    reporter: {
      type: "object",
      optional: true,
    },
    title: {
      type: "string",
      label: "title",
    },
    component: {
      type: "string",
      optional: true,
    },
    votes: {
      type: "string",
      optional: true,
    },
    watches: {
      type: "string",
      optional: true,
    },
    content: {
      type: "object",
    },
    assignee: {
      type: "string",
      optional: true,
    },
    state: {
      type: "string",
      optional: true,
    },
    version: {
      type: "string",
      optional: true,
    },
    edited_on: {
      type: "string",
      optional: true,
    },
    created_on: {
      type: "string",
      optional: true,
    },
    milestone: {
      type: "string",
      optional: true,
    },
    updated_on: {
      type: "string",
      optional: true,
    },
    type: {
      type: "string",
      optional: true,
    },
  },
  async run({ $ }) {
    return await axios($, {
      method: "post",
      url: `https://api.bitbucket.org/2.0/repositories/${this.username}/${this.repo_slug}/issues`,
      headers: {
        Authorization: `Bearer ${this.bitbucket.$auth.oauth_access_token}`,
      },
      data: {
        username: this.username,
        repo_slug: this.repo_slug,
        priority: this.priority,
        kind: this.kind,
        repository: this.repository,
        links: this.links,
        reporter: this.reporter,
        title: this.title,
        component: this.component,
        votes: this.votes,
        watches: this.watches,
        content: this.content,
        assignee: this.assignee,
        state: this.state,
        version: this.version,
        edited_on: this.edited_on,
        created_on: this.created_on,
        milestone: this.milestone,
        updated_on: this.updated_on,
        type: this.type,
      },
    });
  },
};
