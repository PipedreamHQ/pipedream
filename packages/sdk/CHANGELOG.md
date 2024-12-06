<!-- markdownlint-disable MD024 -->
# Changelog

## [1.0.10] - 2024-12-04

### Changed

- Handle correct casing of `stringOptions` in configure prop response

## [1.0.9] - 2024-12-04

### Added

- `triggerDeploy` preview API
- `client.version` and `x-pd-sdk-version` header

## [1.0.8] - 2024-11-29

### Changed

- Fix fallback WebSocket import (for new components API)

## [1.0.7] - 2024-11-21

### Changed

- The backend client now correctly uses asynchronous messaging to handle long running
  operations.
- Updated the backend command line tool to respect the `ENVIRONMENT` env variable
  if set.

## [1.0.6] - 2024-11-20

### Changed

- Use client Connect tokens to make api calls directly from the client.
- Deprecated the `environments` property on `createFrontendClient` since it is now
  stored in the token

## [1.0.5] - 2024-11-18

### Changed

- The backend client used to default to `production` if the environment was not
specified. Now `environment` is a required argument for `createBackendClient`
and must be one of `production` or `development`.  

## [1.0.4] - 2024-11-15

### Changed

- Improved the docs of the `getAccountById` method in the backend client to
  clarify the behavior of the new argument.

- Fixed the exported `HTTPAuthType` enum so that it can be used by the consumers
  of the SDK.

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
