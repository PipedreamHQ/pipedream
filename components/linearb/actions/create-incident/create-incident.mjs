import app from "../../linearb.app.mjs";

export default {
  key: "linearb-create-incident",
  name: "Create Incident",
  description: "Create a new incident within the LinearB platform. [See the documentation](https://docs.linearb.io/api-incidents/#create-incident)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    providerId: {
      type: "string",
      label: "Provider ID",
      description: "The unique identifier of the incident in your incident management provider. Eg. `provider_internal_id1`",
    },
    httpUrl: {
      type: "string",
      label: "HTTP URL",
      description: "The URL of your incident management provider. The combination `http_url/provider_key` should open the incident in your PM provider. Eg. `http://myprovider.io/1`",
    },
    title: {
      type: "string",
      label: "Title",
      description: "The title of the incident",
    },
    issuedAt: {
      type: "string",
      label: "Issued At",
      description: "The specific time when the incident was logged and officially opened. (timestamp ISO 8601 format). Eg. `2019-09-26T07:58:30.996`",
    },
    startedAt: {
      type: "string",
      label: "Started At",
      description: "The specific time when work on the incident commenced. (timestamp ISO 8601 format). Eg. `2019-09-26T07:58:30.996`",
      optional: true,
    },
    endedAt: {
      type: "string",
      label: "Ended At",
      description: "The specific time when the incident was successfully resolved. (timestamp ISO 8601 format). Eg. `2019-09-26T07:58:30.996`",
      optional: true,
    },
    gitRef: {
      type: "string",
      label: "Git Ref",
      description: "The Git reference of the release responsible for causing this incident, Eg. commit short or long sha or tag name (Eg. commit short or long sha/tag name).",
      optional: true,
    },
    teams: {
      propDefinition: [
        app,
        "teams",
      ],
      optional: true,
    },
    services: {
      propDefinition: [
        app,
        "services",
      ],
      optional: true,
    },
    repositoryUrls: {
      type: "string[]",
      label: "Repository URLs",
      description: "The list of repos urls related to this incident. Eg. `https://github.com/myorg/repo1.git`",
      optional: true,
    },
  },
  methods: {
    createIncident(args = {}) {
      return this.app.post({
        path: "/incidents",
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      createIncident,
      providerId,
      httpUrl,
      title,
      issuedAt,
      startedAt,
      endedAt,
      gitRef,
      teams,
      services,
      repositoryUrls,
    } = this;

    const response = await createIncident({
      $,
      data: {
        provider_id: providerId,
        http_url: httpUrl,
        title,
        issued_at: issuedAt,
        started_at: startedAt,
        ended_at: endedAt,
        git_ref: gitRef,
        teams,
        services,
        repository_urls: repositoryUrls,
      },
    });

    $.export("$summary", "Successfully created incident");
    return response;
  },
};
