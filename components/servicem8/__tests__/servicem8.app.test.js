const {
  describe,
  it,
  expect,
  beforeAll,
  beforeEach,
} = require("@jest/globals");

describe("servicem8.app.mjs", () => {
  let servicem8App;
  let axios;

  beforeAll(async () => {
    await jest.unstable_mockModule("@pipedream/platform", () => ({
      axios: jest.fn(),
    }));
    const appMod = await import("../servicem8.app.mjs");
    servicem8App = appMod.default;
    ({ axios } = await import("@pipedream/platform"));
  });

  beforeEach(() => {
    axios.mockReset();
  });

  function ctx() {
    const $ = {};
    return {
      $auth: {
        oauth_access_token: "test-oauth-token",
      },
      ...servicem8App.methods,
      $,
    };
  }

  describe("URL helpers", () => {
    it("resourceListPath and resourceItemPath use api_1.0 and .json suffix", () => {
      const c = ctx();
      expect(c.resourceListPath("job")).toBe("api_1.0/job.json");
      expect(c.resourceItemPath("job", "uuid-1")).toBe("api_1.0/job/uuid-1.json");
    });
  });

  describe("_makeRequest", () => {
    it("GET merges auth and passes path and query params", async () => {
      axios.mockResolvedValue({
        data: [],
      });
      const c = ctx();
      await c._makeRequest({
        path: "api_1.0/job.json",
        params: {
          $filter: "active eq 1",
        },
      });
      expect(axios).toHaveBeenCalledWith(c, expect.objectContaining({
        url: "https://api.servicem8.com/api_1.0/job.json",
        method: "GET",
        headers: expect.objectContaining({
          Authorization: "Bearer test-oauth-token",
        }),
        params: {
          $filter: "active eq 1",
        },
      }));
    });

    it("POST with object body sets JSON content type", async () => {
      axios.mockResolvedValue({});
      const c = ctx();
      const body = {
        name: "Acme",
      };
      await c._makeRequest({
        path: "api_1.0/company.json",
        method: "POST",
        data: body,
      });
      expect(axios).toHaveBeenCalledWith(c, expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          "Content-Type": "application/json",
        }),
        data: body,
      }));
    });

    it("POST with formUrlEncoded sets application/x-www-form-urlencoded", async () => {
      axios.mockResolvedValue({});
      const c = ctx();
      const data = "object=Job";
      await c._makeRequest({
        path: "webhook_subscriptions",
        method: "DELETE",
        data,
        formUrlEncoded: true,
      });
      expect(axios).toHaveBeenCalledWith(c, expect.objectContaining({
        method: "DELETE",
        data,
        headers: expect.objectContaining({
          "Content-Type": "application/x-www-form-urlencoded",
        }),
      }));
    });
  });

  describe("CRUD helpers", () => {
    it("listResource GETs the list path with params", async () => {
      axios.mockResolvedValue([]);
      const c = ctx();
      await c.listResource({
        $: c.$,
        resource: "job",
        params: {
          $filter: "active eq 1",
        },
      });
      expect(axios).toHaveBeenCalledWith(c.$, expect.objectContaining({
        url: "https://api.servicem8.com/api_1.0/job.json",
        method: "GET",
        params: {
          $filter: "active eq 1",
        },
      }));
    });

    it("createResource POSTs and returns record UUID from response headers", async () => {
      axios.mockResolvedValue({
        data: {
          ok: true,
        },
        headers: {
          "x-record-uuid": "new-uuid",
        },
      });
      const c = ctx();
      const out = await c.createResource({
        $: c.$,
        resource: "company",
        data: {
          name: "X",
        },
      });
      expect(out).toEqual({
        body: {
          ok: true,
        },
        recordUuid: "new-uuid",
      });
      expect(axios).toHaveBeenCalledWith(c.$, expect.objectContaining({
        method: "POST",
        url: "https://api.servicem8.com/api_1.0/company.json",
        returnFullResponse: true,
      }));
    });

    it("deleteResource issues DELETE to the item path", async () => {
      axios.mockResolvedValue({});
      const c = ctx();
      await c.deleteResource({
        $: c.$,
        resource: "note",
        uuid: "u1",
      });
      expect(axios).toHaveBeenCalledWith(c.$, expect.objectContaining({
        method: "DELETE",
        url: "https://api.servicem8.com/api_1.0/note/u1.json",
      }));
    });
  });

  describe("webhooks and messaging", () => {
    it("listWebhooks GETs webhook_subscriptions", async () => {
      axios.mockResolvedValue([]);
      const c = ctx();
      await c.listWebhooks({
        $: c.$,
      });
      expect(axios).toHaveBeenCalledWith(c.$, expect.objectContaining({
        method: "GET",
        url: "https://api.servicem8.com/webhook_subscriptions",
      }));
    });

    it("setHook POSTs webhook_subscriptions with params", async () => {
      axios.mockResolvedValue({});
      const c = ctx();
      const params = {
        callback_url: "https://example.com/hook",
        object: "Job",
      };
      await c.setHook({
        $: c.$,
        params,
      });
      expect(axios).toHaveBeenCalledWith(c.$, expect.objectContaining({
        method: "POST",
        url: "https://api.servicem8.com/webhook_subscriptions",
        params,
      }));
    });

    it("removeHook DELETEs webhook_subscriptions with form body", async () => {
      axios.mockResolvedValue({});
      const c = ctx();
      const data = "object=Job";
      await c.removeHook({
        $: c.$,
        data,
      });
      expect(axios).toHaveBeenCalledWith(c.$, expect.objectContaining({
        method: "DELETE",
        url: "https://api.servicem8.com/webhook_subscriptions",
        data,
      }));
    });

    it("sendSms POSTs platform_service_sms", async () => {
      axios.mockResolvedValue({});
      const c = ctx();
      const data = {
        to: "+100",
        message: "hi",
      };
      await c.sendSms({
        $: c.$,
        data,
      });
      expect(axios).toHaveBeenCalledWith(c.$, expect.objectContaining({
        method: "POST",
        url: "https://api.servicem8.com/platform_service_sms",
        data,
      }));
    });

    it("sendEmail POSTs platform_service_email and forwards extra headers", async () => {
      axios.mockResolvedValue({});
      const c = ctx();
      const data = {
        to: "a@b.com",
        subject: "S",
      };
      const headers = {
        "x-impersonate-uuid": "staff-uuid",
      };
      await c.sendEmail({
        $: c.$,
        data,
        headers,
      });
      expect(axios).toHaveBeenCalledWith(c.$, expect.objectContaining({
        method: "POST",
        url: "https://api.servicem8.com/platform_service_email",
        data,
        headers: expect.objectContaining(headers),
      }));
    });
  });
});
