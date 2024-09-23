import {
  ServerClient, createClient,
} from "../index";
import fetchMock from "jest-fetch-mock";
import { ClientCredentials } from "simple-oauth2";

describe("ServerClient", () => {
  let client: ServerClient;

  beforeEach(() => {
    fetchMock.resetMocks();
  });

  describe("createClient", () => {
    it("should mock the createClient method and return a ServerClient instance", () => {
      const params = {
        publicKey: "test-public-key",
        secretKey: "test-secret-key",
      };

      const client = createClient(params);
      expect(client).toBeInstanceOf(ServerClient);
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

      client = new ServerClient({
        publicKey: "test-public-key",
        secretKey: "test-secret-key",
      });

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

      client = new ServerClient({
        publicKey: "test-public-key",
        secretKey: "test-secret-key",
      });

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

      client = new ServerClient({
        publicKey: "test-public-key",
        secretKey: "test-secret-key",
      });

      await expect(client.makeRequest("/bad-path")).rejects.toThrow("HTTP error! status: 404, body: Not Found");
      expect(fetchMock).toHaveBeenCalledWith(
        "https://api.pipedream.com/v1/bad-path",
        expect.any(Object),
      );
    });
  });

  describe("makeApiRequest", () => {
    it("should include OAuth Authorization header and make an API request", async () => {
      const getTokenMock = jest.fn().mockResolvedValue({
        token: {
          access_token: "mocked-oauth-token",
        },
        expired: jest.fn().mockReturnValue(false),
      });

      const oauthClientMock = {
        getToken: getTokenMock,
      } as unknown as ClientCredentials;

      // Inject the mock oauthClient into the ServerClient instance
      client = new ServerClient(
        {
          publicKey: "test-public-key",
          secretKey: "test-secret-key",
          oauthClientId: "test-client-id",
          oauthClientSecret: "test-client-secret",
        },
        oauthClientMock,
      );

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

      const result = await client["makeApiRequest"]("/test-path");

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
      // Create a mock oauthClient that fails to get a token
      const getTokenMock = jest.fn().mockRejectedValue(new Error("Invalid credentials"));

      const oauthClientMock = {
        getToken: getTokenMock,
      } as unknown as ClientCredentials;

      client = new ServerClient(
        {
          publicKey: "test-public-key",
          secretKey: "test-secret-key",
          oauthClientId: "test-client-id",
          oauthClientSecret: "test-client-secret",
        },
        oauthClientMock,
      );

      await expect(client["makeApiRequest"]("/test-path")).rejects.toThrow("Failed to obtain OAuth token: Invalid credentials");
    });
  });

  describe("makeConnectRequest", () => {
    it("should include Connect Authorization header and make a request", async () => {
      client = new ServerClient({
        publicKey: "test-public-key",
        secretKey: "test-secret-key",
      });

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
        "https://api.pipedream.com/v1/connect/test-path",
        expect.objectContaining({
          headers: expect.objectContaining({
            "Authorization": expect.stringContaining("Basic "),
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

      client = new ServerClient({
        publicKey: "test-public-key",
        secretKey: "test-secret-key",
      });

      const result = await client.connectTokenCreate({
        app_slug: "test-app",
        external_user_id: "user-id",
      });

      expect(result).toEqual({
        token: "connect-token",
        expires_at: "2024-01-01T00:00:00Z",
      });
      expect(fetchMock).toHaveBeenCalledWith(
        "https://api.pipedream.com/v1/connect/tokens",
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({
            external_id: "user-id",
            app_slug: "test-app",
            oauth_app_id: undefined,
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

      client = new ServerClient({
        publicKey: "test-public-key",
        secretKey: "test-secret-key",
      });

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
        "https://api.pipedream.com/v1/connect/accounts?include_credentials=1",
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

      client = new ServerClient({
        publicKey: "test-public-key",
        secretKey: "test-secret-key",
      });

      const result = await client.getAccount("account-1");

      expect(result).toEqual({
        id: "account-1",
        name: "Test Account",
      });
      expect(fetchMock).toHaveBeenCalledWith(
        "https://api.pipedream.com/v1/connect/accounts/account-1",
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

      client = new ServerClient({
        publicKey: "test-public-key",
        secretKey: "test-secret-key",
      });

      const result = await client.getAccountsByApp("app-1");

      expect(result).toEqual([
        {
          id: "account-1",
          name: "Test Account",
        },
      ]);
      expect(fetchMock).toHaveBeenCalledWith(
        "https://api.pipedream.com/v1/connect/accounts/app/app-1",
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

      client = new ServerClient({
        publicKey: "test-public-key",
        secretKey: "test-secret-key",
      });

      const result = await client.getAccountsByExternalId("external-id-1");

      expect(result).toEqual([
        {
          id: "account-1",
          name: "Test Account",
        },
      ]);
      expect(fetchMock).toHaveBeenCalledWith(
        "https://api.pipedream.com/v1/connect/accounts/external_id/external-id-1",
        expect.any(Object),
      );
    });
  });

  describe("deleteAccount", () => {
    it("should delete a specific account by ID", async () => {
      fetchMock.mockResponseOnce("", {
        status: 204,
      });

      client = new ServerClient({
        publicKey: "test-public-key",
        secretKey: "test-secret-key",
      });

      await client.deleteAccount("account-1");

      expect(fetchMock).toHaveBeenCalledWith(
        "https://api.pipedream.com/v1/connect/accounts/account-1",
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

      client = new ServerClient({
        publicKey: "test-public-key",
        secretKey: "test-secret-key",
      });

      await client.deleteAccountsByApp("app-1");

      expect(fetchMock).toHaveBeenCalledWith(
        "https://api.pipedream.com/v1/connect/accounts/app/app-1",
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

      client = new ServerClient({
        publicKey: "test-public-key",
        secretKey: "test-secret-key",
      });

      await client.deleteExternalUser("external-id-1");

      expect(fetchMock).toHaveBeenCalledWith(
        "https://api.pipedream.com/v1/connect/users/external-id-1",
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

      client = new ServerClient({
        publicKey: "test-public-key",
        secretKey: "test-secret-key",
      });

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
        "https://api.pipedream.com/v1/connect/projects/info",
        expect.objectContaining({
          method: "GET",
        }),
      );
    });
  });

  describe("invokeWorkflow", () => {
    it("should invoke a workflow with provided URL and body", async () => {
      // Create a mock oauthClient
      const getTokenMock = jest.fn().mockResolvedValue({
        token: {
          access_token: "mocked-oauth-token",
        },
        expired: jest.fn().mockReturnValue(false),
      });

      const oauthClientMock = {
        getToken: getTokenMock,
      } as unknown as ClientCredentials;

      // Inject the mock oauthClient into the ServerClient instance
      client = new ServerClient(
        {
          publicKey: "test-public-key",
          secretKey: "test-secret-key",
          oauthClientId: "test-client-id",
          oauthClientSecret: "test-client-secret",
        },
        oauthClientMock,
      );

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
            Authorization: "Bearer mocked-oauth-token",
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

      const client = new ServerClient(
        {
          publicKey: "test-public-key",
          secretKey: "test-secret-key",
          oauthClientId: "test-client-id",
          oauthClientSecret: "test-client-secret",
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
      const result1 = await client["makeApiRequest"]("/test-path");

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
});
