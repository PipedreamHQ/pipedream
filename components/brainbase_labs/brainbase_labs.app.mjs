import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "brainbase_labs",
  propDefinitions: {
    workerId: {
      type: "string",
      label: "Worker ID",
      description: "The unique identifier for the worker",
      async options() {
        const data = await this.listWorkers();
        return (
          data?.map(({
            id: value, name: label,
          }) => ({
            label,
            value,
          })) || []
        );
      },
    },
    flowId: {
      type: "string",
      label: "Flow ID",
      description: "The unique identifier for the flow",
      async options({ workerId }) {
        const data = await this.listFlows({
          workerId,
        });
        return (
          data?.map(({
            id: value, name: label,
          }) => ({
            label,
            value,
          })) || []
        );
      },
    },
    deploymentId: {
      type: "string",
      label: "Deployment ID",
      description: "The unique identifier for the voice deployment",
      async options({ workerId }) {
        const data = await this.listVoiceDeployments({
          workerId,
        });
        return (
          data?.map(({
            id: value, name: label,
          }) => ({
            label,
            value,
          })) || []
        );
      },
    },
    integrationId: {
      type: "string",
      label: "Integration ID",
      description: "The unique identifier for the integration",
      async options() {
        const data = await this.listIntegrations();
        return (
          data?.map(({
            id: value, type: label,
          }) => ({
            label: `${label} - ${value}`,
            value,
          })) || []
        );
      },
    },
    phoneNumberId: {
      type: "string",
      label: "Phone Number ID",
      description: "The unique identifier for the phone number",
      async options({ integrationId }) {
        const params = {};
        if (integrationId) {
          params.integrationId = integrationId;
        }
        const { data } = await this.getPhoneNumbers({
          params,
        });
        return (
          data?.map(({
            id: value, phoneNumber: label,
          }) => ({
            label,
            value,
          })) || []
        );
      },
    },
    voiceDeploymentLogId: {
      type: "string",
      label: "Voice Deployment Log ID",
      description: "The unique identifier for the voice deployment log entry",
      async options({ workerId }) {
        const { data } = await this.listVoiceDeploymentLogs({
          workerId,
        });
        return data?.map(({ id }) => id) || [];
      },
    },
  },
  methods: {
    getUrl(path) {
      return `https://brainbase-monorepo-api.onrender.com${path}`;
    },
    getHeaders(headers) {
      return {
        ...headers,
        "x-api-key": this.$auth.api_key,
        "Content-Type": "application/json",
      };
    },
    _makeRequest({
      $ = this, path, headers, ...args
    } = {}) {
      return axios($, {
        ...args,
        url: this.getUrl(path),
        headers: this.getHeaders(headers),
      });
    },
    post(args = {}) {
      return this._makeRequest({
        method: "POST",
        ...args,
      });
    },
    patch(args = {}) {
      return this._makeRequest({
        method: "PATCH",
        ...args,
      });
    },
    put(args = {}) {
      return this._makeRequest({
        method: "PUT",
        ...args,
      });
    },
    delete(args = {}) {
      return this._makeRequest({
        method: "DELETE",
        ...args,
      });
    },
    // Assets
    deletePhoneNumber({
      phoneNumberId, ...args
    } = {}) {
      return this.delete({
        path: `/api/team/assets/phone_numbers/${phoneNumberId}/delete`,
        ...args,
      });
    },
    getPhoneNumbers(args = {}) {
      return this._makeRequest({
        path: "/api/team/assets/phone_numbers",
        ...args,
      });
    },
    registerPhoneNumber(args = {}) {
      return this.post({
        path: "/api/team/assets/register_phone_number",
        ...args,
      });
    },
    // Flows
    createFlow({
      workerId, ...args
    } = {}) {
      return this.post({
        path: `/api/workers/${workerId}/flows`,
        ...args,
      });
    },
    deleteFlow({
      workerId, flowId, ...args
    } = {}) {
      return this.delete({
        path: `/api/workers/${workerId}/flows/${flowId}`,
        ...args,
      });
    },
    getFlow({
      workerId, flowId, ...args
    } = {}) {
      return this._makeRequest({
        path: `/api/workers/${workerId}/flows/${flowId}`,
        ...args,
      });
    },
    listFlows({
      workerId, ...args
    } = {}) {
      return this._makeRequest({
        path: `/api/workers/${workerId}/flows`,
        ...args,
      });
    },
    updateFlow({
      workerId, flowId, ...args
    } = {}) {
      return this.patch({
        path: `/api/workers/${workerId}/flows/${flowId}`,
        ...args,
      });
    },
    // Integrations
    createTwilioIntegration(args = {}) {
      return this.post({
        path: "/api/team/integrations/twilio/create",
        ...args,
      });
    },
    deleteIntegration({
      integrationId, ...args
    } = {}) {
      return this.delete({
        path: `/api/team/integrations/twilio/${integrationId}/delete`,
        ...args,
      });
    },
    getIntegration({
      integrationId, ...args
    } = {}) {
      return this._makeRequest({
        path: `/api/team/integrations/${integrationId}`,
        ...args,
      });
    },
    listIntegrations(args = {}) {
      return this._makeRequest({
        path: "/api/team/integrations",
        ...args,
      });
    },
    // Team
    getTeam(args = {}) {
      return this._makeRequest({
        path: "/api/team",
        ...args,
      });
    },
    // Voice Deployment Logs
    listVoiceDeploymentLogs({
      workerId, ...args
    } = {}) {
      return this._makeRequest({
        path: `/api/workers/${workerId}/deploymentLogs/voice`,
        ...args,
      });
    },
    getVoiceDeploymentLog({
      workerId, logId, ...args
    } = {}) {
      return this._makeRequest({
        path: `/api/workers/${workerId}/deploymentLogs/voice/${logId}`,
        ...args,
      });
    },
    // Voice Deployments
    createVoiceDeployment({
      workerId, ...args
    } = {}) {
      return this.post({
        path: `/api/workers/${workerId}/deployments/voice`,
        ...args,
      });
    },
    deleteVoiceDeployment({
      workerId, deploymentId, ...args
    } = {}) {
      return this.delete({
        path: `/api/workers/${workerId}/deployments/voice/${deploymentId}`,
        ...args,
      });
    },
    getVoiceDeployment({
      workerId, deploymentId, ...args
    } = {}) {
      return this._makeRequest({
        path: `/api/workers/${workerId}/deployments/voice/${deploymentId}`,
        ...args,
      });
    },
    listVoiceDeployments({
      workerId, ...args
    } = {}) {
      return this._makeRequest({
        path: `/api/workers/${workerId}/deployments/voice`,
        ...args,
      });
    },
    makeVoiceBatchCalls({
      workerId, deploymentId, ...args
    } = {}) {
      return this.post({
        path: `/api/workers/${workerId}/deployments/voice/${deploymentId}/make-batch-calls`,
        ...args,
      });
    },
    updateVoiceDeployment({
      workerId, deploymentId, ...args
    } = {}) {
      return this.patch({
        path: `/api/workers/${workerId}/deployments/voice/${deploymentId}`,
        ...args,
      });
    },
    // Workers
    createWorker(args = {}) {
      return this.post({
        path: "/api/workers",
        ...args,
      });
    },
    deleteWorker({
      workerId, ...args
    } = {}) {
      return this.delete({
        path: `/api/workers/${workerId}`,
        ...args,
      });
    },
    getWorker({
      workerId, ...args
    } = {}) {
      return this._makeRequest({
        path: `/api/workers/${workerId}`,
        ...args,
      });
    },
    listWorkers(args = {}) {
      return this._makeRequest({
        path: "/api/workers",
        ...args,
      });
    },
    updateWorker({
      workerId, ...args
    } = {}) {
      return this.patch({
        path: `/api/workers/${workerId}`,
        ...args,
      });
    },
  },
};
