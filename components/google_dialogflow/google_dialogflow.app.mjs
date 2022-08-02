import {
  AgentsClient,
  IntentsClient,
  SessionsClient,
  ContextsClient,
  EntityTypesClient,
} from "@google-cloud/dialogflow";
import fs from "fs";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "google_dialogflow",
  propDefinitions: {
    intent: {
      label: "Intent Name",
      description: "Intent to be selected in Dialogflow",
      type: "string",
      async options() {
        const [
          intents,
        ] = await this.listIntents();
        return {
          options: intents.map((intent) => ({
            label: intent.displayName,
            value: intent.name,
          })),
        };
      },
    },
    entityTypeId: {
      label: "Entity Type ID",
      description: "Existing entity type ID",
      type: "string",
      async options() {
        const [
          entityTypes,
        ] = await this.listEntityTypes();
        return {
          options: entityTypes.map((et) => ({
            label: et.displayName,
            value: et.name,
          })),
        };
      },
    },
    displayName: {
      label: "Display Name",
      description: "Display name of the entity type",
      type: "string",
      optional: true,
    },
    enableFuzzyExtraction: {
      label: "Enable Fuzzy Extraction",
      description: "Enable fuzzy extraction flag",
      type: "boolean",
      optional: true,
    },
    sessionId: {
      label: "Session ID",
      description: "A unique session ID, ID of the session created when a context created can be used, e.g. `acb92b1d-0a8c-4369-a5fa-ddd7954b2b46`",
      type: "string",
    },
    name: {
      label: "Name",
      description: "Entity type name",
      type: "string",
    },
    languageCode: {
      label: "Language Code",
      description: "Language code of the entity type",
      type: "string",
      options: constants.languageCodes,
      optional: true,
    },
    entities: {
      label: "Entities",
      description: "Provide an array with IEntity objects, e.g. `{\"value\":\"cat\", \"synonyms\":[\"kitten\", \"kitty\"]}` See [client API docs](https://googleapis.dev/nodejs/dialogflow/latest/google.cloud.dialogflow.v2beta1.EntityType.IEntity.html)",
      type: "string[]",
    },
    lifespanCount: {
      label: "Lifespan Count",
      description: "Context lifespan count",
      type: "integer",
      optional: true,
    },
    parameters: {
      label: "Parameters",
      description: "Context parameters, [See object definition](https://googleapis.dev/nodejs/dialogflow/latest/google.protobuf.IStruct.html)",
      type: "object",
      optional: true,
    },
    additionalProps: {
      label: "Additional Props",
      description: "Additional properties that can be sent with the request",
      type: "object",
      optional: true,
    },
    entityTypeKind: {
      label: "Entity Type Kind",
      description: "EntityType kind, [See](https://googleapis.dev/nodejs/dialogflow/latest/google.cloud.dialogflow.v2beta1.EntityType.html#.Kind)",
      type: "string",
      options: constants.entityTypeKind,
    },
    matchMode: {
      label: "Match Mode",
      description: "Match Mode enum, [See](https://googleapis.dev/nodejs/dialogflow/latest/google.cloud.dialogflow.v2.Agent.html#.MatchMode)",
      type: "string",
      options: constants.matchMode,
      optional: true,
    },
    autoExpansionMode: {
      label: "Auto Expansion Mode",
      description: "EntityType auto expansion mode, [See](https://googleapis.dev/nodejs/dialogflow/latest/google.cloud.dialogflow.v2beta1.EntityType.html#.AutoExpansionMode)",
      type: "string",
      options: constants.autoExpansionMode,
      optional: true,
    },
    additionalFields: {
      label: "More Fields",
      description: "Additional fields for the object type",
      type: "object",
      optional: true,
    },
  },
  methods: {
    _getAuthKeyJson() { return JSON.parse(this.$auth.key_json); },
    _getProjectId() { return this._getAuthKeyJson().project_id; },
    _getSDKParams() {
      return {
        credentials: {
          client_email: this._getAuthKeyJson().client_email,
          private_key: this._getAuthKeyJson().private_key,
        },
        projectId: this._getAuthKeyJson().project_id,
      };
    },
    getAgentsClient() { return new AgentsClient(this._getSDKParams()); },
    getIntentClient() { return new IntentsClient(this._getSDKParams()); },
    getSessionClient() { return new SessionsClient(this._getSDKParams()); },
    getContextClient() { return new ContextsClient(this._getSDKParams()); },
    getEntityTypesClient() { return new EntityTypesClient(this._getSDKParams()); },
    async createUpdateAgent(args = {}) {
      return this.getAgentsClient().setAgent({
        agent: {
          parent: this.getAgentsClient().projectPath(this._getProjectId()),
          ...args,
        },
      });
    },
    async getAgent() {
      return this.getAgentsClient().getAgent({
        parent: this.getAgentsClient().projectPath(this._getProjectId()),
      });
    },
    async deleteAgent() {
      return this.getAgentsClient().deleteAgent({
        parent: this.getAgentsClient().projectPath(this._getProjectId()),
      });
    },
    async createIntent(args = {}) {
      return this.getIntentClient().createIntent({
        parent: this.getIntentClient().projectAgentPath(this._getProjectId()),
        ...args,
      });
    },
    async getIntent(args = {}) {
      return this.getIntentClient().getIntent(args);
    },
    async listIntents() { //paginations are not working with pageSize and pageToken
      return this.getIntentClient().listIntents({
        parent: this.getIntentClient().projectAgentPath(this._getProjectId()),
      });
    },
    async deleteIntent(args = {}) {
      return this.getIntentClient().deleteIntent(args);
    },
    async detectIntent({
      inputAudioFile,
      sessionId,
      ...otherParams
    } = {}) {
      const inputAudio = inputAudioFile ?
        fs.readFileSync(inputAudioFile) :
        undefined;
      const sessionPath = this.getSessionClient().projectAgentSessionPath(
        this._getProjectId(),
        sessionId,
      );
      return this.getSessionClient().detectIntent({
        session: sessionPath,
        inputAudio,
        ...otherParams,
      });
    },
    async createContext({
      name,
      sessionId,
      ...args
    } = {}) {
      return this.getContextClient().createContext({
        parent: this.getContextClient().projectAgentSessionPath(
          this._getProjectId(),
          sessionId,
        ),
        context: {
          name: this.getContextClient().projectAgentSessionContextPath(
            this._getProjectId(),
            sessionId,
            name,
          ),
          ...args,
        },
      });
    },
    async updateContext({
      name,
      sessionId,
      ...args
    } = {}) {
      return this.getContextClient().createContext({
        parent: this.getContextClient().projectAgentSessionPath(
          this._getProjectId(),
          sessionId,
        ),
        context: {
          name: this.getContextClient().projectAgentSessionContextPath(
            this._getProjectId(),
            sessionId,
            name,
          ),
          ...args,
        },
      });
    },
    async getContext({ name } = {}) {
      return await this.getContextClient().getContext({
        name,
      });
    },
    async listContexts({ sessionId } = {}) {
      return this.getContextClient().listContexts({
        parent: this.getContextClient().projectAgentSessionPath(
          this._getProjectId(),
          sessionId,
        ),
      });
    },
    async deleteContext({ name } = {}) {
      return this.getContextClient().deleteContext({
        name,
      });
    },
    async createEntityType(args = {}) {
      return this.getEntityTypesClient().createEntityType({
        parent: this.getEntityTypesClient().projectAgentPath(
          this._getProjectId(),
        ),
        ...args,
      });
    },
    async getEntityType(args = {}) {
      return this.getEntityTypesClient().getEntityType({
        parent: this.getEntityTypesClient().projectAgentPath(
          this._getProjectId(),
        ),
        ...args,
      });
    },
    async updateEntityType(args = {}) {
      return this.getEntityTypesClient().updateEntityType({
        parent: this.getEntityTypesClient().projectAgentPath(
          this._getProjectId(),
        ),
        ...args,
      });
    },
    async listEntityTypes(args = {}) { //paginations are not working with pageSize and pageToken
      return this.getEntityTypesClient().listEntityTypes({
        parent: this.getEntityTypesClient().projectAgentPath(
          this._getProjectId(),
        ),
        ...args,
      });
    },
    async deleteEntityType(args = {}) {
      return this.getEntityTypesClient().deleteEntityType({
        ...args,
      });
    },
    async createEntities({
      entityTypeId,
      ...args
    } = {}) {
      return this.getEntityTypesClient().batchCreateEntities({
        parent: entityTypeId,
        ...args,
      });
    },
    async deleteEntities({
      entityTypeId,
      ...args
    } = {}) {
      return this.getEntityTypesClient().batchDeleteEntities({
        parent: entityTypeId,
        ...args,
      });
    },
  },
};
