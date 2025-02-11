import { jest } from "@jest/globals"
import {
  BackendClient,
  BackendClientOpts,
  createBackendClient,
  HTTPAuthType,
} from "../index.js";
import isEqual from "lodash.isequal"

const fetchMock = setupFetchMock() // see bottom of file

const projectId = "proj_abc123";
const clientParams: BackendClientOpts = {
  environment: "production",
  credentials: {
    clientId: "test-client-id",
    clientSecret: "test-client-secret",
  },
  projectId,
};

let client: BackendClient;
let customDomainClient: BackendClient;

beforeEach(() => {
  client = new BackendClient(
    clientParams,
  );
  customDomainClient = new BackendClient({
    ...clientParams,
    workflowDomain: "example.com",
  });
});

afterEach(() => {
  jest.clearAllMocks();
});

describe("BackendClient", () => {
  describe("createBackendClient", () => {
    it("should mock the createBackendClient method and return a BackendClient instance", () => {
      const client = createBackendClient(clientParams);
      expect(client).toBeInstanceOf(BackendClient);
    });
  });

  describe("makeRequest", () => {
    it("should make a GET request successfully", async () => {
      fetchMock.expect({
        request: {
          url: "https://api.pipedream.com/v1/test-path",
        },
        response: {
          json: {
            data: "test-response",
          },
        },
      })

      const result = await client.makeRequest("/test-path", {
        method: "GET",
      });

      expect(result).toEqual({
        data: "test-response",
      });
    });

    it("should make a POST request with JSON body", async () => {
      fetchMock.expect({
        request: {
          url: "https://api.pipedream.com/v1/test-path",
          json: {
            key: "value",
          },
        },
        response: {
          json: {
            success: true,
          },
        },
      })

      const result = await client.makeRequest("/test-path", {
        method: "POST",
        body: {
          key: "value",
        },
      });

      expect(result).toEqual({
        success: true,
      });
    });

    it("should handle non-200 HTTP responses", async () => {
      fetchMock.expect({
        request: {
          url: "https://api.pipedream.com/v1/bad-path",
        },
        response: new Response("Not Found", {
          status: 404,
          headers: {
            "Content-Type": "text/plain",
          },
        }),
      });

      await expect(client.makeRequest("/bad-path")).rejects.toThrow("HTTP error! status: 404, body: Not Found");
    });
  });

  describe("makeAuthorizedRequest", () => {
    it("should include OAuth Authorization header and make an API request", async () => {
      const accessToken = fetchMock.expectAccessTokenSuccess();
      fetchMock.expect({
        request: {
          url: "https://api.pipedream.com/v1/test-path",
          headersContaining: {
            authorization: `Bearer ${accessToken}`,
          },
        },
        response: {
          json: {
            success: true,
          },
        },
      })

      const result = await client["makeAuthorizedRequest"]("/test-path");

      expect(result).toEqual({
        success: true,
      });
    });

    it("should handle OAuth token retrieval failure", async () => {
      fetchMock.expectAccessTokenFailure();
      await expect(client.makeAuthorizedRequest("/test-path")).rejects.toThrow();
    });
  });

  describe("makeConnectRequest", () => {
    it("should include Connect Authorization header and make a request", async () => {
      const accessToken = fetchMock.expectAccessTokenSuccess();
      fetchMock.expect({
        request: {
          url: `https://api.pipedream.com/v1/connect/${projectId}/test-path`,
          headersContaining: {
            authorization: `Bearer ${accessToken}`,
          },
        },
        response: {
          json: {
            success: true,
          },
        },
      })

      const result = await client["makeConnectRequest"]("/test-path");

      expect(result).toEqual({
        success: true,
      });
    });
  });

  describe("createConnectToken", () => {
    it("should create a connect token", async () => {
      fetchMock.expectAccessTokenSuccess();
      fetchMock.expect({
        request: {
          url: `https://api.pipedream.com/v1/connect/${projectId}/tokens`,
          headersContaining: {
            "X-PD-Environment": "production",
          },
          json: {
            external_user_id: "user-id",
            external_id: "user-id",
          },
        },
        response: {
          json: {
            token: "connect-token",
            expires_at: "2024-01-01T00:00:00Z",
          },
        },
      });

      const result = await client.createConnectToken({
        external_user_id: "user-id",
      });

      expect(result).toEqual({
        token: "connect-token",
        expires_at: "2024-01-01T00:00:00Z",
      });
    });

    it("should create a connect token with optional redirect URIs", async () => {
      fetchMock.expectAccessTokenSuccess();
      fetchMock.expect({
        request: {
          url: `https://api.pipedream.com/v1/connect/${projectId}/tokens`,
          json: {
            external_user_id: "user-id",
            success_redirect_uri: "https://example.com/success",
            error_redirect_uri: "https://example.com/error",
            external_id: "user-id",
          },
        },
        response: {
          json: {
            token: "connect-token-with-redirects",
            expires_at: "2024-01-01T00:00:00Z",
          },
        },
      });

      const result = await client.createConnectToken({
        external_user_id: "user-id",
        success_redirect_uri: "https://example.com/success",
        error_redirect_uri: "https://example.com/error",
      });

      expect(result).toEqual({
        token: "connect-token-with-redirects",
        expires_at: "2024-01-01T00:00:00Z",
      });
    });
  });

  describe("getAccounts", () => {
    it("should retrieve accounts", async () => {
      fetchMock.expectAccessTokenSuccess();
      fetchMock.expect({
        request: {
          url: `https://api.pipedream.com/v1/connect/${projectId}/accounts?include_credentials=true`,
        },
        response: {
          json: {
            data: [
              {
                id: "account-1",
                name: "Test Account",
              },
            ],
          },
        },
      })

      const result = await client.getAccounts({
        include_credentials: true,
      });

      expect(result.data).toEqual([
        {
          id: "account-1",
          name: "Test Account",
        },
      ]);
    });
  });

  describe("getAccountById", () => {
    it("should retrieve a specific account by ID", async () => {
      fetchMock.expectAccessTokenSuccess();
      fetchMock.expect({
        request: {
          url: `https://api.pipedream.com/v1/connect/${projectId}/accounts/account-1`,
        },
        response: {
          json: {
            id: "account-1",
            name: "Test Account",
          },
        },
      });

      const result = await client.getAccountById("account-1");

      expect(result).toEqual({
        id: "account-1",
        name: "Test Account",
      });
    });

    it("should include credentials when the flag is set", async () => {
      fetchMock.expectAccessTokenSuccess();
      fetchMock.expect({
        request: {
          url: `https://api.pipedream.com/v1/connect/${projectId}/accounts/account-1?include_credentials=true`,
        },
        response: {
          json: {
            id: "account-1",
            name: "Test Account",
            credentials: {},
          },
        },
      });

      const result = await client.getAccountById("account-1", {
        include_credentials: true,
      });

      expect(result).toEqual({
        id: "account-1",
        name: "Test Account",
        credentials: {},
      });
    });
  });

  describe("Get accounts by app", () => {
    it("should retrieve accounts associated with a specific app", async () => {
      fetchMock.expectAccessTokenSuccess();
      fetchMock.expect({
        request: {
          url: `https://api.pipedream.com/v1/connect/${projectId}/accounts?app=app-1`,
        },
        response: {
          json: [
            {
              id: "account-1",
              name: "Test Account",
            },
          ],
        },
      });

      const result = await client.getAccounts({
        app: "app-1",
      });

      expect(result).toEqual([
        {
          id: "account-1",
          name: "Test Account",
        },
      ]);
    });
  });

  describe("Get accounts by external user ID", () => {
    it("should retrieve accounts associated with a specific external ID", async () => {
      fetchMock.expectAccessTokenSuccess();
      fetchMock.expect({
        request: {
          url: `https://api.pipedream.com/v1/connect/${projectId}/accounts?external_user_id=external-id-1`,
        },
        response: {
          json: [
            {
              id: "account-1",
              name: "Test Account",
            },
          ],
        },
      });

      const result = await client.getAccounts({
        external_user_id: "external-id-1",
      });

      expect(result).toEqual([
        {
          id: "account-1",
          name: "Test Account",
        },
      ]);
    });
  });

  describe("deleteAccount", () => {
    it("should delete a specific account by ID", async () => {
      fetchMock.expectAccessTokenSuccess();
      fetchMock.expect({
        request: {
          method: "DELETE",
          url: `https://api.pipedream.com/v1/connect/${projectId}/accounts/account-1`,
        },
        response: {
          status: 204,
        },
      });

      await client.deleteAccount("account-1");
    });
  });

  describe("deleteAccountsByApp", () => {
    it("should delete all accounts associated with a specific app", async () => {
      fetchMock.expectAccessTokenSuccess();
      fetchMock.expect({
        request: {
          method: "DELETE",
          url: `https://api.pipedream.com/v1/connect/${projectId}/accounts/app/app-1`,
        },
        response: {
          status: 204,
        },
      });

      await client.deleteAccountsByApp("app-1");
    });
  });

  describe("deleteExternalUser", () => {
    it("should delete all accounts associated with a specific external ID", async () => {
      fetchMock.expectAccessTokenSuccess();
      fetchMock.expect({
        request: {
          method: "DELETE",
          url: `https://api.pipedream.com/v1/connect/${projectId}/users/external-id-1`,
        },
        response: {
          status: 204,
        },
      });

      await client.deleteExternalUser("external-id-1");
    });
  });

  describe("getProjectInfo", () => {
    it("should retrieve project info", async () => {
      fetchMock.expectAccessTokenSuccess();
      fetchMock.expect({
        request: {
          method: "GET",
          url: `https://api.pipedream.com/v1/connect/${projectId}/projects/info`,
        },
        response: {
          json: {
            apps: [
              {
                id: "app-1",
                name_slug: "test-app",
              },
            ],
          },
        },
      })

      const result = await client.getProjectInfo();

      expect(result).toEqual({
        apps: [
          {
            id: "app-1",
            name_slug: "test-app",
          },
        ],
      });
    });
  });

  describe("invokeWorkflow", () => {
    beforeEach(() => {
      client = new BackendClient({
        ...clientParams,
        workflowDomain: "example.com",
      });
    });

    it("should invoke a workflow with provided URL and body, with no auth type", async () => {
      fetchMock.expect({
        request: {
          method: "POST",
          url: "https://example.com/workflow",
          json: {
            foo: "bar",
          },
          headersContaining: {
            "X-PD-Environment": "production",
          },
        },
        response: {
          json: {
            result: "workflow-response",
          },
        },
      })

      const result = await client.invokeWorkflow("https://example.com/workflow", {
        body: {
          foo: "bar",
        },
      });

      expect(result).toEqual({
        result: "workflow-response",
      });
    });

    it("should invoke a workflow with OAuth auth type", async () => {
      const token = "" + Math.random()
      fetchMock.expectAccessTokenSuccess({
        accessToken: token,
      });
      fetchMock.expect({
        request: {
          url: "https://example.com/workflow",
          headersContaining: {
            authorization: `Bearer ${token}`,
          },
        },
        response: {
          json: {
            result: "workflow-response",
          },
        },
      })

      const result = await client.invokeWorkflow("https://example.com/workflow", {}, HTTPAuthType.OAuth);

      expect(result).toEqual({
        result: "workflow-response",
      });
    });

    it("should invoke a workflow with static bearer auth type", async () => {
      const token = "" + Math.random()
      fetchMock.expect({
        request: {
          url: "https://example.com/workflow",
          headersContaining: {
            Authorization: `Bearer ${token}`,
          },
        },
        response: {
          json: {
            result: "workflow-response",
          },
        },
      })

      const result = await client.invokeWorkflow("https://example.com/workflow", {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      }, HTTPAuthType.StaticBearer);

      expect(result).toEqual({
        result: "workflow-response",
      });
    });
  });

  describe("OAuth Token Handling", () => {
    it("should refresh token when expired", async () => {
      // First request will get the expired token and fetch a new one
      fetchMock.expectAccessTokenFailure();
      fetchMock.expectAccessTokenSuccess();
      fetchMock.expect({
        request: {
          url: "https://api.pipedream.com/v1/test-path",
        },
        response: {
          json: {
            success: true,
          },
        },
      })

      const result1 = await client["makeAuthorizedRequest"]("/test-path");

      expect(result1).toEqual({
        success: true,
      });
    });
  });

  describe("invokeWorkflowForExternalUser", () => {
    let client: BackendClient;

    beforeEach(() => {
      client = new BackendClient({
        ...clientParams,
        workflowDomain: "example.com",
      });
    });

    it("should include externalUserId and environment headers", async () => {
      fetchMock.expectAccessTokenSuccess();
      fetchMock.expect({
        request: {
          url: "https://example.com/workflow",
          headersContaining: {
            "X-PD-External-User-ID": "external-user-id",
            "X-PD-Environment": "production",
          },
        },
        response: {
          json: {
            result: "workflow-response",
          },
        },
      })

      const result = await client.invokeWorkflowForExternalUser("https://example.com/workflow", "external-user-id", {
        body: {
          foo: "bar",
        },
      });

      expect(result).toEqual({
        result: "workflow-response",
      });
    });

    it("should throw error when externalUserId is missing", async () => {
      await expect(client.invokeWorkflowForExternalUser("https://example.com/workflow", "", {
        body: {
          foo: "bar",
        },
      })).rejects.toThrow("External user ID is required");
    });

    it("should throw error when externalUserId is blank", async () => {
      await expect(client.invokeWorkflowForExternalUser("https://example.com/workflow", "    ", {
        body: {
          foo: "bar",
        },
      })).rejects.toThrow("External user ID is required");
    });

    it("should throw error when the URL is blank", async () => {
      await expect(client.invokeWorkflowForExternalUser("  ", "external-user-id", {
        body: {
          foo: "bar",
        },
      })).rejects.toThrow("Workflow URL is required");
    });
  });

  describe("BackendClient - buildWorkflowUrl", () => {
    describe("Validations", () => {
      it("should throw an error when the input is blank", () => {
        expect(() => client["buildWorkflowUrl"]("   ")).toThrow("URL or endpoint ID is required");
      });

      it("should throw an error when the URL doesn't match the workflow domain", () => {
        const url = "https://example.com";
        expect(() => client["buildWorkflowUrl"](url)).toThrow("Invalid workflow domain");
      });

      it("should throw an error when the endpoint ID doesn't match the expected format", () => {
        const input = "foo123";
        expect(() => client["buildWorkflowUrl"](input)).toThrow("Invalid endpoint ID format");
      });
    });

    describe("Default domain (m.pipedream.net)", () => {
      it("should return full URL if input is a full URL with protocol", () => {
        const input = "https://en123.m.pipedream.net";
        const expected = "https://en123.m.pipedream.net/";
        expect(client["buildWorkflowUrl"](input)).toBe(expected);
      });

      it("should return full URL if input is a URL without protocol", () => {
        const input = "en123.m.pipedream.net";
        const expected = "https://en123.m.pipedream.net/";
        expect(client["buildWorkflowUrl"](input)).toBe(expected);
      });

      it("should construct URL with 'm.pipedream.net' if input is an endpoint ID", () => {
        const input = "en123";
        const expected = "https://en123.m.pipedream.net";
        expect(client["buildWorkflowUrl"](input)).toBe(expected);
      });

      it("should handle input with a path in full URL with protocol", () => {
        const input = "https://en123.m.pipedream.net/foo";
        const expected = "https://en123.m.pipedream.net/foo";
        expect(client["buildWorkflowUrl"](input)).toBe(expected);
      });

      it("should handle input with a path when no protocol is provided", () => {
        const input = "en123.m.pipedream.net/foo";
        const expected = "https://en123.m.pipedream.net/foo";
        expect(client["buildWorkflowUrl"](input)).toBe(expected);
      });
    });

    describe("Custom domain (example.com)", () => {
      it("should return full URL if input is a full URL with protocol", () => {
        const input = "https://en123.example.com";
        const expected = "https://en123.example.com/";
        expect(customDomainClient["buildWorkflowUrl"](input)).toBe(expected);
      });

      it("should return full URL if input is a URL without protocol", () => {
        const input = "en123.example.com";
        const expected = "https://en123.example.com/";
        expect(customDomainClient["buildWorkflowUrl"](input)).toBe(expected);
      });

      it("should construct URL with 'example.com' if input is an endpoint ID", () => {
        const input = "en123";
        const expected = "https://en123.example.com";
        expect(customDomainClient["buildWorkflowUrl"](input)).toBe(expected);
      });

      it("should handle input with a path in full URL with protocol", () => {
        const input = "https://en123.example.com/foo";
        const expected = "https://en123.example.com/foo";
        expect(customDomainClient["buildWorkflowUrl"](input)).toBe(expected);
      });

      it("should handle input with a path when no protocol is provided", () => {
        const input = "en123.example.com/foo";
        const expected = "https://en123.example.com/foo";
        expect(customDomainClient["buildWorkflowUrl"](input)).toBe(expected);
      });
    });
  });
});

type ExpectRequest = {
  method?: string
  url?: string | RegExp
  json?: Record<string, unknown>
  headersContaining?: Record<string, string>
}
type MockResponse =
  | Response
  | { status?: number; json?: unknown }
type IfOpts = {
  method: string
  url: string
  headers: Record<string, string> // NonNullable<RequestInit["headers"]>
  json?: unknown // body json
  // XXX etc.
}
function setupFetchMock() {
  let intercepts: {
    if: (opts: IfOpts) => boolean
    response: () => Response
  }[] = []

  const jsonResponse = (o: unknown, opts?: { status?: number }) => {
    return new Response(JSON.stringify(o), {
      status: opts?.status,
      headers: {
        "content-type": "application/json",
      },
    })
  }

  beforeEach(() => {
    intercepts = [];
    // without these generics this fails typecheck and can't figure out why
    jest.spyOn<any, any, any>(global, "fetch").mockImplementation(jest.fn<typeof fetch>(async (...args: Parameters<typeof fetch>) => { // eslint-disable-line @typescript-eslint/no-explicit-any
      const [
        url,
        init,
      ] = args
      let json: unknown
      if (init?.body && typeof init.body === "string") {
        try {
          json = JSON.parse(init.body)
        } catch {
          // pass
        }
      }
      if (url instanceof Request) {
        throw new Error("not supported")
      }
      const ifOpts: IfOpts = {
        method: init?.method || "GET",
        url: url.toString(),
        headers: init?.headers as Record<string, string> || {},
        json,
      }
      for (let i = 0; i < intercepts.length; i++) {
        const intercept = intercepts[i]
        if (intercept.if(ifOpts)) {
          intercepts.splice(i, 1)
          return intercept.response()
        }
      }
      throw new Error(`Request to ${url} not intercepted`)
    }) as jest.Mock);
  })

  afterEach(() => {
    if (intercepts.length) {
      throw new Error("Expected requests not yet intercepted")
    }
  })

  // const _expect = (opts: { if: (opts: IfOpts) => boolean, jsonResponse?: any, response?: Response }) => {
  const _expect = (opts: { request: ExpectRequest, response: MockResponse }) => {
    const {
      method, url, headersContaining, json,
    } = opts.request
    intercepts.push({
      if: (ifOpts) => {
        if (method && ifOpts.method !== method) return false
        if (url) {
          if (typeof url === "string") return url === ifOpts.url
          if (url instanceof RegExp) return !!ifOpts.url.match(url)
          throw new Error(`unexpected type for request.url: ${url}`)
        }
        if (headersContaining) {
          for (const header in headersContaining) {
            if (ifOpts.headers[header.toLowerCase()] !== headersContaining[header.toLowerCase()]) {
              return false
            }
          }
        }
        if (json && !isEqual(json, ifOpts.json)) {
          return false
        }
        return true
      },
      response: () => {
        if (opts.response instanceof Response) {
          return opts.response
        }
        if (opts.response.json) {
          return jsonResponse(opts.response.json, {
            status: opts.response.status,
            // XXX...
          })
        }
        return new Response(null, {
          status: opts.response.status,
          headers: {
            "content-type": "text/plain",
          },
        })
      },
    })
  }

  const expectAccessTokenSuccess = (opts?: { accessToken?: string; expiresIn?: number }) => {
    const accessToken = opts?.accessToken || "" + Math.random()
    _expect({
      request: {
        url: /\/v1\/oauth\/token$/,
      },
      response: {
        json: {
          access_token: accessToken,
          token_type: "Bearer",
          expires_in: opts?.expiresIn ?? 3600,
        },
      },
    })
    return accessToken
  }

  const expectAccessTokenFailure = () => {
    _expect({
      request: {
        url: /\/v1\/oauth\/token$/,
      },
      response: new Response("", {
        status: 401,
        headers: {
          "content-type": "application/json",
        },
      }),
    })
  }

  return {
    expect: _expect,
    expectAccessTokenSuccess,
    expectAccessTokenFailure,
  }
}
