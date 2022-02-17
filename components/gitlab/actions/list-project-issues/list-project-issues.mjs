// legacy_hash_id: a_EVioWG
import { axios } from "@pipedream/platform";

export default {
  key: "gitlab-list-project-issues",
  name: "List Project Issues",
  description: "Get a list of a project's issues.",
  version: "0.3.1",
  type: "action",
  props: {
    gitlab: {
      type: "app",
      app: "gitlab",
    },
    iids: {
      type: "any",
      description: "Return only the issues having the given iid",
      optional: true,
    },
    state: {
      type: "string",
      description: "Return all issues or just those that are opened or closed",
      optional: true,
      options: [
        "opened",
        "closed",
        "all",
      ],
    },
    labels: {
      type: "string",
      description: "Comma-separated list of label names, issues must have all labels to be returned. None lists all issues with no labels. Any lists all issues with at least one label. No+Label (Deprecated) lists all issues with no labels. Predefined names are case-insensitive.",
      optional: true,
    },
    with_labels_details: {
      type: "boolean",
      description: "If true, response will return more details for each label in labels field: :name, :color, :description, :description_html, :text_color. Default is false. description_html Introduced in GitLab 12.7",
      optional: true,
    },
    milestone: {
      type: "string",
      description: "The milestone title. None lists all issues with no milestone. Any lists all issues that have an assigned milestone.",
      optional: true,
    },
    scope: {
      type: "string",
      description: "Return issues for the given scope: created_by_me, assigned_to_me or all. Defaults to created_by_me\nFor versions before 11.0, use the now deprecated created-by-me or assigned-to-me scopes instead.",
      optional: true,
      options: [
        "all",
        "created_by_me",
        "assigned_to_me",
      ],
    },
    author_id: {
      type: "integer",
      description: "Return issues created by the given user id. Mutually exclusive with author_username. Combine with scope=all or scope=assigned_to_me.",
      optional: true,
    },
    author_username: {
      type: "string",
      description: "Return issues created by the given username. Similar to author_id and mutually exclusive with author_id.",
      optional: true,
    },
    assignee_id: {
      type: "integer",
      description: "Return issues assigned to the given user id. Mutually exclusive with assignee_username. None returns unassigned issues. Any returns issues with an assignee.",
      optional: true,
    },
    assignee_username: {
      type: "any",
      description: "Return issues assigned to the given username. Similar to assignee_id and mutually exclusive with assignee_id. In CE version assignee_username array should only contain a single value or an invalid param error will be returned otherwise.",
      optional: true,
    },
    my_reaction_emoji: {
      type: "string",
      description: "Return issues reacted by the authenticated user by the given emoji. None returns issues not given a reaction. Any returns issues given at least one reaction.",
      optional: true,
    },
    weight: {
      type: "string",
      description: "Return issues with the specified weight. None returns issues with no weight assigned. Any returns issues with a weight assigned.",
      optional: true,
    },
    order_by: {
      type: "string",
      description: "Return issues ordered by created_at, updated_at, priority, due_date, relative_position, label_priority, milestone_due, popularity, weight fields. Default is created_at",
      optional: true,
      options: [
        "created_at",
        "updated_at",
        "priority",
        "due_date",
        "relative_position",
        "label_priority",
        "milestone_due",
        "popularity",
        "weight ",
      ],
    },
    sort: {
      type: "string",
      description: "Return issues sorted in asc or desc order. Default is desc",
      optional: true,
      options: [
        "asc",
        "desc",
      ],
    },
    search: {
      type: "string",
      description: "Search issues against their title and description.",
      optional: true,
    },
    search_in: {
      type: "string",
      description: "Modify the scope of the search attribute. title, description, or a string joining them with comma. Default is title,description",
      optional: true,
    },
    created_after: {
      type: "string",
      description: "Return issues created on or after the given time.",
      optional: true,
    },
    created_before: {
      type: "string",
      description: "Return issues created on or before the given time",
      optional: true,
    },
    updated_after: {
      type: "string",
      description: "Return issues updated on or after the given time",
      optional: true,
    },
    updated_before: {
      type: "string",
      description: "Return issues updated on or before the given time",
      optional: true,
    },
    confidential: {
      type: "boolean",
      description: "Filter confidential or public issues.",
      optional: true,
    },
    not: {
      type: "string",
      description: "Return issues that do not match the parameters supplied. Accepts: labels, milestone, author_id, author_username, assignee_id, assignee_username, my_reaction_emoji, search, in",
      optional: true,
    },
    id: {
      type: "string",
      description: "The ID or URL-encoded path of the project owned by the authenticated user",
    },
  },
  async run({ $ }) {
    var queryString = "";

    var growQueryString = function(param_name, param_value, current_query_string) {
      var newQueryString = "";

      if (current_query_string.indexOf("?") > -1) {
        newQueryString = current_query_string + "&" + param_name + "=" + param_value;
      } else {
        newQueryString = "?" + param_name + "=" + param_value;
      }
      return newQueryString;
    };

    var growQueryString2 = function(param_name, param_value, current_query_string) {
      var newQueryString = "";

      if (current_query_string.indexOf("?") > -1) {
        newQueryString = current_query_string + "&&" + param_name + "=" + param_value;
      } else {
        newQueryString = "?" + param_name + "=" + param_value;
      }
      return newQueryString;
    };

    if (this.iids) {
      var iids = JSON.parse(this.iids);
      for (var i = 0; i < iids.length; i++) {
        queryString = growQueryString2("iids[]", iids[i], queryString);
      }
    }

    if (this.state) {
      queryString = growQueryString("state", this.state, queryString);
    }

    if (this.labels) {
      queryString = growQueryString("labels", this.labels, queryString);
    }

    if (this.with_labels_details) {
      queryString = growQueryString("with_labels_details", this.with_labels_details, queryString);
    }

    if (this.milestone) {
      queryString = growQueryString("milestone", this.milestone, queryString);
    }

    if (this.scope) {
      queryString = growQueryString("scope", this.scope, queryString);
    }

    if (this.author_id) {
      queryString = growQueryString("author_id", this.author_id, queryString);
    }

    if (this.author_username) {
      queryString = growQueryString("author_username", this.author_username, queryString);
    }

    if (this.assignee_id) {
      queryString = growQueryString("assignee_id", this.assignee_id, queryString);
    }

    if (this.assignee_username) {
      try {
        //Gitlab Community Edition uses a single element array
        var assigneeUsernameArray =  JSON.parse(this.assignee_username);
        queryString = growQueryString("assignee_username", assigneeUsernameArray[0], queryString);
      } catch {
        //Gitlab Enterprise uses plain string
        queryString = growQueryString("assignee_username", this.assignee_username, queryString);
      }
    }

    if (this.my_reaction_emoji) {
      queryString = growQueryString("my_reaction_emoji", this.my_reaction_emoji, queryString);
    }

    if (this.weight ) {
      queryString = growQueryString("weight", this.weight, queryString);
    }

    if (this.order_by) {
      queryString = growQueryString("order_by", this.order_by, queryString);
    }

    if (this.sort) {
      queryString = growQueryString("sort", this.sort, queryString);
    }

    if (this.search) {
      queryString = growQueryString("search", this.search, queryString);
    }

    if (this.search_in) {
      queryString = growQueryString("in", this.search_in, queryString);
    }

    if (this.created_after) {
      queryString = growQueryString("created_after", this.created_after, queryString);
    }

    if (this.created_before) {
      queryString = growQueryString("created_before", this.created_before, queryString);
    }

    if (this.updated_after) {
      queryString = growQueryString("updated_after", this.updated_after, queryString);
    }

    if (this.updated_before) {
      queryString = growQueryString("updated_before", this.updated_before, queryString);
    }

    if (this.confidential) {
      queryString = growQueryString("confidential", this.confidential, queryString);
    }

    if (this.not) {
      queryString = growQueryString("not", this.not, queryString);
    }

    try {
      $.export("resp", await axios($, {
        url: `https://gitlab.com/api/v4/projects/${this.id}/issues${queryString}`,
        headers: {
          Authorization: `Bearer ${this.gitlab.$auth.oauth_access_token}`,
        },
      }));
    } catch (err) {
      $.export("err", err);
    }
  },
};
