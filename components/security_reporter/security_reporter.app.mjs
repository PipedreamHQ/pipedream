import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "security_reporter",
  propDefinitions: {
    name: {
      type: "string",
      label: "Name",
      description: "Optional name for the event",
      optional: true,
    },
    mode: {
      type: "string",
      label: "Mode",
      description: "Optional mode for the event",
      optional: true,
    },
    includes: {
      type: "string",
      label: "Includes",
      description: "Optional includes for the event",
      optional: true,
    },
    assessmentId: {
      type: "string",
      label: "Assessment ID",
      description: "The ID of the assessment",
      async options() {
        const assessments = await this.listAssessments();
        return assessments.map((assessment) => ({
          label: assessment.title,
          value: assessment.id,
        }));
      },
    },
    findingId: {
      type: "string",
      label: "Finding ID",
      description: "The ID of the finding",
      async options() {
        const findings = await this.listFindings();
        return findings.map((finding) => ({
          label: finding.title,
          value: finding.id,
        }));
      },
    },
    clientId: {
      type: "string",
      label: "Client ID",
      description: "The ID of the client",
      async options() {
        const clients = await this.listClients();
        return clients.map((client) => ({
          label: client.name,
          value: client.id,
        }));
      },
    },
    assessmentTemplateId: {
      type: "string",
      label: "Assessment Template ID",
      description: "The ID of the assessment template",
      async options() {
        const templates = await this.listAssessmentTemplates();
        return templates.map((template) => ({
          label: template.name,
          value: template.id,
        }));
      },
    },
    languageId: {
      type: "string",
      label: "Language ID",
      description: "The ID of the language",
      optional: true,
      async options() {
        const languages = await this.listLanguages();
        return languages.map((language) => ({
          label: language.name,
          value: language.id,
        }));
      },
    },
    themeId: {
      type: "string",
      label: "Theme ID",
      description: "The ID of the theme",
      optional: true,
      async options() {
        const themes = await this.listThemes();
        return themes.map((theme) => ({
          label: theme.name,
          value: theme.id,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://trial3.securityreporter.app/api";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "GET",
        path = "/",
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          Authorization: `Bearer ${this.$auth.oauth_access_token}`,
        },
      });
    },
    async listAssessments(opts = {}) {
      return this._makeRequest({
        path: "/assessments",
        ...opts,
      });
    },
    async listFindings(opts = {}) {
      return this._makeRequest({
        path: "/findings",
        ...opts,
      });
    },
    async listClients(opts = {}) {
      return this._makeRequest({
        path: "/clients",
        ...opts,
      });
    },
    async listAssessmentTemplates(opts = {}) {
      return this._makeRequest({
        path: "/assessment-templates",
        ...opts,
      });
    },
    async listLanguages(opts = {}) {
      return this._makeRequest({
        path: "/languages",
        ...opts,
      });
    },
    async listThemes(opts = {}) {
      return this._makeRequest({
        path: "/themes",
        ...opts,
      });
    },
    async emitEvent(type, opts = {}) {
      const {
        name, mode, includes,
      } = opts;
      const event = {
        type,
        name,
        mode,
        includes,
      };
      this.$emit(event, {
        summary: `New event: ${type}`,
        id: new Date().toISOString(),
      });
    },
    async createSecurityFinding(opts = {}) {
      const {
        assessmentId,
        title,
        targets,
        assessmentSectionId,
        isVulnerability,
        description,
        severityMetrics,
        severity,
        foundAt,
        priority,
        complexity,
        action,
        risk,
        recommendation,
        proof,
        references,
        draftDocuments,
        resolvers,
        userGroups,
        classifications,
        ...otherOpts
      } = opts;

      const response = await this._makeRequest({
        method: "POST",
        path: "/findings",
        data: {
          assessment_id: assessmentId,
          title,
          targets,
          assessment_section_id: assessmentSectionId,
          is_vulnerability: isVulnerability,
          description,
          severity_metrics: severityMetrics,
          severity,
          found_at: foundAt,
          priority,
          complexity,
          action,
          risk,
          recommendation,
          proof,
          references,
          draft_documents: draftDocuments,
          resolvers,
          user_groups: userGroups,
          classifications,
        },
        ...otherOpts,
      });

      await this.emitEvent("finding:created", opts);
      return response;
    },
    async updateSecurityFinding(opts = {}) {
      const {
        findingId,
        title,
        targets,
        assessmentSectionId,
        isVulnerability,
        description,
        severityMetrics,
        severity,
        foundAt,
        priority,
        complexity,
        action,
        risk,
        recommendation,
        proof,
        references,
        draftDocuments,
        resolvers,
        userGroups,
        classifications,
        ...otherOpts
      } = opts;

      const response = await this._makeRequest({
        method: "PUT",
        path: `/findings/${findingId}`,
        data: {
          title,
          targets,
          assessment_section_id: assessmentSectionId,
          is_vulnerability: isVulnerability,
          description,
          severity_metrics: severityMetrics,
          severity,
          found_at: foundAt,
          priority,
          complexity,
          action,
          risk,
          recommendation,
          proof,
          references,
          draft_documents: draftDocuments,
          resolvers,
          user_groups: userGroups,
          classifications,
        },
        ...otherOpts,
      });

      await this.emitEvent("finding:updated", opts);
      return response;
    },
    async createSecurityAssessment(opts = {}) {
      const {
        clientId,
        assessmentTemplateId,
        title,
        languageId,
        tags,
        description,
        scoringSystem,
        themeId,
        ...otherOpts
      } = opts;

      const response = await this._makeRequest({
        method: "POST",
        path: "/assessments",
        data: {
          client_id: clientId,
          assessment_template_id: assessmentTemplateId,
          title,
          language_id: languageId,
          tags,
          description,
          scoring_system: scoringSystem,
          theme_id: themeId,
        },
        ...otherOpts,
      });

      await this.emitEvent("assessment:created", opts);
      return response;
    },
  },
};
