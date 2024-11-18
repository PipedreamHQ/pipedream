<!-- markdownlint-disable MD024 -->
# Changelog

## [1.0.3] - 2024-11-14

### Added

- Added a new argument to the `getAccountById` method in the backend client to
  allow the client to retrieve the credentials of the corresponding account.

## [1.0.2] - 2024-11-14

### Changed

- Deprecated the `environment_name` field in the `ConnectTokenOpts` type, as it
  is no longer used by the SDK nor the Connect API. The environment name is now
  exclusively determined by the `environment` field in the `BackendClientOpts`
  type, read during the client creation.

### Added

- Added a new optional flag to `RequestOptions` called `fullResponse`, which
  allows the user to get the full HTTP response object, including the headers
  and status code.

## [1.0.0] - 2024-11-01

### Changed

- Renamed the server-side client class from `ServerClient` to `BackendClient` to
  better indicate its purpose.
- Removed the `oauthClient` optional argument to the `BackendClient` constructor
- Renamed the client factory methods so that developers can know exactly the
  kind of client they are creating.
- Removed project-key-based authentication in favor of a more secure
  token-based authentication using OAuth.
