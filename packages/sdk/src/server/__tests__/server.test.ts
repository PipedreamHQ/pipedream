import {
  BackendClient, createClient, HTTPAuthType,
} from "../index";
import fetchMock from "jest-fetch-mock";
import { ClientCredentials } from "simple-oauth2";

let client: BackendClient;
let customDomainClient: BackendClient;
let oauthClientMock: ClientCredentials;
const projectId = "proj_abc123";

beforeEach(() => {
  const getTokenMock = jest.fn().mockResolvedValue({
    token: {
      access_token: "mocked-oauth-token",
    },
    expired: jest.fn().mockReturnValue(false),
  });

  oauthClientMock = {
    getToken: getTokenMock,
  } as unknown as ClientCredentials;

  client = new BackendClient(
    {
      oauth: {
        clientId: "test-client-id",
        clientSecret: "test-client-secret",
      },
      projectId,
    },
    oauthClientMock,
  );

  customDomainClient = new BackendClient({
    oauth: {
      clientId: "test-client-id",
      clientSecret: "test-client-secret",
    },
    projectId,
    baseWorkflowDomain: "example.com",
  });
});

afterEach(() => {
  fetchMock.resetMocks();
  jest.clearAllMocks();
});

describe("BackendClient", () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  describe("createClient", () => {
    it("should mock the createClient method and return a BackendClient instance", () => {
      const params = {
        oauth: {
          clientId: "test-client-id",
          clientSecret: "test",
        },
        projectId,
      };

      client = createClient(params);
      expect(client).toBeInstanceOf(BackendClient);
    });
  });

  describe("makeRequest", () => {
    it("should make a GET request successfully", async () => {
      fetchMock.mockResponseOnce(
        JSON.stringify({
          data: "test-response",
        }),
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      const result = await client.makeRequest("/test-path", {
        method: "GET",
      });

      expect(result).toEqual({
        data: "test-response",
      });
      expect(fetchMock).toHaveBeenCalledWith(
        "https://api.pipedream.com/v1/test-path",
        expect.any(Object),
      );
    });

    it("should make a POST request with JSON body", async () => {
      fetchMock.mockResponseOnce(
        JSON.stringify({
          success: true,
        }),
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      const result = await client.makeRequest("/test-path", {
        method: "POST",
        body: {
          key: "value",
        },
      });

      expect(result).toEqual({
        success: true,
      });
      expect(fetchMock).toHaveBeenCalledWith(
        "https://api.pipedream.com/v1/test-path",
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({
            key: "value",
          }),
          headers: expect.objectContaining({
            "Content-Type": "application/json",
          }),
        }),
      );
    });

    it("should handle non-200 HTTP responses", async () => {
      fetchMock.mockResponseOnce("Not Found", {
        status: 404,
        headers: {
          "Content-Type": "text/plain",
        },
      });

      await expect(client.makeRequest("/bad-path")).rejects.toThrow("HTTP error! status: 404, body: Not Found");
      expect(fetchMock).toHaveBeenCalledWith(
        "https://api.pipedream.com/v1/bad-path",
        expect.any(Object),
      );
    });
  });

  describe("makeAuthorizedRequest", () => {
    it("should include OAuth Authorization header and make an API request", async () => {
      fetchMock.mockResponseOnce(
        JSON.stringify({
          success: true,
        }),
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      const result = await client["makeAuthorizedRequest"]("/test-path");

      expect(result).toEqual({
        success: true,
      });
      expect(fetchMock).toHaveBeenCalledWith(
        "https://api.pipedream.com/v1/test-path",
        expect.objectContaining({
          headers: expect.objectContaining({
            "Authorization": "Bearer mocked-oauth-token",
            "Content-Type": "application/json",
          }),
        }),
      );
    });

    it("should handle OAuth token retrieval failure", async () => {
      oauthClientMock.getToken = jest.fn().mockRejectedValue(new Error("Invalid credentials"));
      await expect(client["makeAuthorizedRequest"]("/test-path")).rejects.toThrow("Failed to obtain OAuth token: Invalid credentials");
    });
  });

  describe("makeConnectRequest", () => {
    it("should include Connect Authorization header and make a request", async () => {
      fetchMock.mockResponseOnce(
        JSON.stringify({
          success: true,
        }),
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      const result = await client["makeConnectRequest"]("/test-path");

      expect(result).toEqual({
        success: true,
      });
      expect(fetchMock).toHaveBeenCalledWith(
        `https://api.pipedream.com/v1/connect/${projectId}/test-path`,
        expect.objectContaining({
          headers: expect.objectContaining({
            "Authorization": expect.stringContaining("Bearer "),
          }),
        }),
      );
    });
  });

  describe("connectTokenCreate", () => {
    it("should create a connect token", async () => {
      fetchMock.mockResponseOnce(
        JSON.stringify({
          token: "connect-token",
          expires_at: "2024-01-01T00:00:00Z",
        }),
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      const result = await client.connectTokenCreate({
        external_user_id: "user-id",
      });

      expect(result).toEqual({
        token: "connect-token",
        expires_at: "2024-01-01T00:00:00Z",
      });
      expect(fetchMock).toHaveBeenCalledWith(
        `https://api.pipedream.com/v1/connect/${projectId}/tokens`,
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({
            external_user_id: "user-id",
            external_id: "user-id",
          }),
          headers: expect.objectContaining({
            "Authorization": expect.any(String),
            "Content-Type": "application/json",
          }),
        }),
      );
    });

    it("should create a connect token with optional redirect URIs", async () => {
      fetchMock.mockResponseOnce(
        JSON.stringify({
          token: "connect-token-with-redirects",
          expires_at: "2024-01-01T00:00:00Z",
        }),
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      const result = await client.connectTokenCreate({
        external_user_id: "user-id",
        success_redirect_uri: "https://example.com/success",
        error_redirect_uri: "https://example.com/error",
      });

      expect(result).toEqual({
        token: "connect-token-with-redirects",
        expires_at: "2024-01-01T00:00:00Z",
      });
      expect(fetchMock).toHaveBeenCalledWith(
        `https://api.pipedream.com/v1/connect/${projectId}/tokens`,
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({
            external_user_id: "user-id",
            success_redirect_uri: "https://example.com/success",
            error_redirect_uri: "https://example.com/error",
            external_id: "user-id",
          }),
          headers: expect.objectContaining({
            "Authorization": expect.any(String),
            "Content-Type": "application/json",
          }),
        }),
      );
    });
  });

  describe("getAccounts", () => {
    it("should retrieve accounts", async () => {
      fetchMock.mockResponseOnce(
        JSON.stringify([
          {
            id: "account-1",
            name: "Test Account",
          },
        ]),
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      const result = await client.getAccounts({
        include_credentials: 1,
      });

      expect(result).toEqual([
        {
          id: "account-1",
          name: "Test Account",
        },
      ]);
      expect(fetchMock).toHaveBeenCalledWith(
        `https://api.pipedream.com/v1/connect/${projectId}/accounts?include_credentials=1`,
        expect.any(Object),
      );
    });
  });

  describe("getAccount", () => {
    it("should retrieve a specific account by ID", async () => {
      fetchMock.mockResponseOnce(
        JSON.stringify({
          id: "account-1",
          name: "Test Account",
        }),
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      const result = await client.getAccount("account-1");

      expect(result).toEqual({
        id: "account-1",
        name: "Test Account",
      });
      expect(fetchMock).toHaveBeenCalledWith(
        `https://api.pipedream.com/v1/connect/${projectId}/accounts/account-1`,
        expect.any(Object),
      );
    });
  });

  describe("getAccountsByApp", () => {
    it("should retrieve accounts associated with a specific app", async () => {
      fetchMock.mockResponseOnce(
        JSON.stringify([
          {
            id: "account-1",
            name: "Test Account",
          },
        ]),
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      const result = await client.getAccountsByApp("app-1");

      expect(result).toEqual([
        {
          id: "account-1",
          name: "Test Account",
        },
      ]);
      expect(fetchMock).toHaveBeenCalledWith(
        `https://api.pipedream.com/v1/connect/${projectId}/accounts/app/app-1`,
        expect.any(Object),
      );
    });
  });

  describe("getAccountsByExternalId", () => {
    it("should retrieve accounts associated with a specific external ID", async () => {
      fetchMock.mockResponseOnce(
        JSON.stringify([
          {
            id: "account-1",
            name: "Test Account",
          },
        ]),
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      const result = await client.getAccountsByExternalId("external-id-1");

      expect(result).toEqual([
        {
          id: "account-1",
          name: "Test Account",
        },
      ]);
      expect(fetchMock).toHaveBeenCalledWith(
        `https://api.pipedream.com/v1/connect/${projectId}/users/external-id-1/accounts`,
        expect.any(Object),
      );
    });
  });

  describe("deleteAccount", () => {
    it("should delete a specific account by ID", async () => {
      fetchMock.mockResponseOnce("", {
        status: 204,
      });

      await client.deleteAccount("account-1");

      expect(fetchMock).toHaveBeenCalledWith(
        `https://api.pipedream.com/v1/connect/${projectId}/accounts/account-1`,
        expect.objectContaining({
          method: "DELETE",
        }),
      );
    });
  });

  describe("deleteAccountsByApp", () => {
    it("should delete all accounts associated with a specific app", async () => {
      fetchMock.mockResponseOnce("", {
        status: 204,
      });

      await client.deleteAccountsByApp("app-1");

      expect(fetchMock).toHaveBeenCalledWith(
        `https://api.pipedream.com/v1/connect/${projectId}/accounts/app/app-1`,
        expect.objectContaining({
          method: "DELETE",
        }),
      );
    });
  });

  describe("deleteExternalUser", () => {
    it("should delete all accounts associated with a specific external ID", async () => {
      fetchMock.mockResponseOnce("", {
        status: 204,
      });

      await client.deleteExternalUser("external-id-1");

      expect(fetchMock).toHaveBeenCalledWith(
        `https://api.pipedream.com/v1/connect/${projectId}/users/external-id-1`,
        expect.objectContaining({
          method: "DELETE",
        }),
      );
    });
  });

  describe("getProjectInfo", () => {
    it("should retrieve project info", async () => {
      fetchMock.mockResponseOnce(
        JSON.stringify({
          apps: [
            {
              id: "app-1",
              name_slug: "test-app",
            },
          ],
        }),
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      const result = await client.getProjectInfo();

      expect(result).toEqual({
        apps: [
          {
            id: "app-1",
            name_slug: "test-app",
          },
        ],
      });
      expect(fetchMock).toHaveBeenCalledWith(
        `https://api.pipedream.com/v1/connect/${projectId}/projects/info`,
        expect.objectContaining({
          method: "GET",
        }),
      );
    });
  });

  describe("invokeWorkflow", () => {
    it("should invoke a workflow with provided URL and body, with no auth type", async () => {
      fetchMock.mockResponseOnce(
        JSON.stringify({
          result: "workflow-response",
        }),
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      const result = await client.invokeWorkflow("https://example.com/workflow", {
        body: {
          foo: "bar",
        },
      });

      expect(result).toEqual({
        result: "workflow-response",
      });
      expect(fetchMock).toHaveBeenCalledWith(
        "https://example.com/workflow",
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({
            foo: "bar",
          }),
          headers: expect.objectContaining({
            "Content-Type": "application/json",
            "X-PD-Environment": "production",
          }),
        }),
      );
    });

    it("should invoke a workflow with OAuth auth type", async () => {
      fetchMock.mockResponseOnce(
        JSON.stringify({
          result: "workflow-response",
        }),
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      const result = await client.invokeWorkflow("https://example.com/workflow", {}, HTTPAuthType.OAuth);

      expect(result).toEqual({
        result: "workflow-response",
      });

      expect(fetchMock).toHaveBeenCalledWith(
        "https://example.com/workflow",
        expect.objectContaining({
          headers: expect.objectContaining({
            "Authorization": "Bearer mocked-oauth-token",
          }),
        }),
      );
    });

    it("should invoke a workflow with static bearer auth type", async () => {
      fetchMock.mockResponseOnce(
        JSON.stringify({
          result: "workflow-response",
        }),
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      const result = await client.invokeWorkflow("https://example.com/workflow", {
        headers: {
          "Authorization": "Bearer static-token",
        },
      }, HTTPAuthType.StaticBearer);

      expect(result).toEqual({
        result: "workflow-response",
      });

      expect(fetchMock).toHaveBeenCalledWith(
        "https://example.com/workflow",
        expect.objectContaining({
          headers: expect.objectContaining({
            "Authorization": "Bearer static-token",
          }),
        }),
      );
    });
  });

  describe("OAuth Token Handling", () => {
    it("should refresh token when expired", async () => {
      // Create mock AccessToken objects
      const expiredTokenMock = {
        token: {
          access_token: "expired-oauth-token",
        },
        expired: jest.fn().mockReturnValue(true),
      };

      const newTokenMock = {
        token: {
          access_token: "new-oauth-token",
        },
        expired: jest.fn().mockReturnValue(false),
      };

      const getTokenMock = jest
        .fn()
        .mockResolvedValueOnce(expiredTokenMock)
        .mockResolvedValueOnce(newTokenMock);

      const oauthClientMock = {
        getToken: getTokenMock,
      } as unknown as ClientCredentials;

      const client = new BackendClient(
        {
          oauth: {
            clientId: "test-client-id",
            clientSecret: "test-client-secret",
          },
          projectId: "proj_abc123",
        },
        oauthClientMock,
      );

      fetchMock.mockResponse(
        JSON.stringify({
          success: true,
        }),
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      // First request will get the expired token and fetch a new one
      const result1 = await client["makeAuthorizedRequest"]("/test-path");

      expect(result1).toEqual({
        success: true,
      });
      expect(getTokenMock).toHaveBeenCalledTimes(2); // One for initial token, one for refresh
      expect(fetchMock).toHaveBeenCalledWith(
        "https://api.pipedream.com/v1/test-path",
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: "Bearer new-oauth-token",
          }),
        }),
      );
    });
  });

  describe("invokeWorkflowForExternalUser", () => {
    let client: BackendClient;

    beforeEach(() => {
      fetchMock.resetMocks();
      // These mocks are distinct from the ones in the outer beforeEach
      // We need to test the behavior of the client when the OAuth token
      // is expired or invalid
      const expiredTokenMock = {
        token: {
          access_token: "expired-oauth-token",
        },
        expired: jest.fn().mockReturnValue(true),
      };

      const newTokenMock = {
        token: {
          access_token: "new-oauth-token",
        },
        expired: jest.fn().mockReturnValue(false),
      };

      const getTokenMock = jest
        .fn()
        .mockResolvedValueOnce(expiredTokenMock)
        .mockResolvedValueOnce(newTokenMock);

      const oauthClientMock = {
        getToken: getTokenMock,
      } as unknown as ClientCredentials;
      client = new BackendClient(
        {
          oauth: {
            clientId: "test-client-id",
            clientSecret: "test-client-secret",
          },
          projectId,
        },
        oauthClientMock,
      );
    });

    afterEach(() => {
      fetchMock.resetMocks();
      jest.clearAllMocks();
    });

    it("should include externalUserId and environment headers", async () => {
      fetchMock.mockResponseOnce(
        JSON.stringify({
          result: "workflow-response",
        }),
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      const result = await client.invokeWorkflowForExternalUser("https://example.com/workflow", "external-user-id", {
        body: {
          foo: "bar",
        },
      });

      expect(result).toEqual({
        result: "workflow-response",
      });

      expect(fetchMock).toHaveBeenCalledWith(
        "https://example.com/workflow",
        expect.objectContaining({
          headers: expect.objectContaining({
            "X-PD-External-User-ID": "external-user-id",
            "X-PD-Environment": "production",
          }),
        }),
      );
    });

    it("should throw error when externalUserId is missing", async () => {
      await expect(client.invokeWorkflowForExternalUser("https://example.com/workflow", "", {
        body: {
          foo: "bar",
        },
      })).rejects.toThrow("External user ID is required");
    });
  });

  describe("BackendClient - buildWorkflowUrl", () => {
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
