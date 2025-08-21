import { defineApp } from "@pipedream/types";
import { axios } from "@pipedream/platform";

export default defineApp({
  type: "app",
  app: "serveravatar",
  propDefinitions: {},
  methods: {
    _getBaseUrl() {
      return "https://api.serveravatar.com";
    },
    _getHeaders() {
      return {
        "content-type": "application/json",
        "authorization": `${this.$auth.api_key}`,
      };
    },
    _getRequestParams(opts: any) {
      return {
        ...opts,
        url: this._getBaseUrl() + opts.path,
        headers: this._getHeaders(),
      };
    },
    async createApplicationDomain(ctx = this, newAppDomainData: any) {
      return await axios(ctx, this._getRequestParams({
        method: "POST",
        path: "/domains",
        data: newAppDomainData,
      }));
    },
    async listTeams() {
      const teamsResponse = await axios(this, this._getRequestParams({
        method: "GET",
        path: "/teams",
      }));
      return teamsResponse.teams;
    },
    async listServers(teams: any[]) {
      const teamServersPromise = teams.map((team: any) => {
        return axios(this, this._getRequestParams({
          method: "GET",
          path: `/teams/${team.id}/servers`,
        }));
      });
      const teamsServers = await Promise.all(teamServersPromise);
      return teamsServers
        .map((teamServers: any) => (teamServers.servers))
        .flat()
        .filter((server: any) => server.status === "1");
    },
    async listAllServersOptions() {
      const teams = await this.listTeams();
      const servers = await this.listServers(teams);
      return servers.map((server: any) => ({
        label: `${server.name} - ${server.ip}`,
        value: server.id,
      }));
    },
    async listApplications(serverId: number, page: number) {
      const serverApplications = await axios(this, this._getRequestParams({
        method: "GET",
        path: `/servers/${serverId}/applications?page=${page}`,
      }));
      return serverApplications?.applications;
    },
    async listApplicationsOptions(serverId: number, prevContext: any) {
      if (!serverId) {
        return [];
      }
      const page = prevContext.page
        ? prevContext.page + 1
        : 1;
      const applications = await this.listApplications(serverId, page);
      const options = applications.data.map((application: any) => ({
        label: `${application.name} - ${application.framework}`,
        value: application.id,
      }));
      return {
        options,
        context: {
          page: applications.current_page,
        },
      };
    },
  },
});
