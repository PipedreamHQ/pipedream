<!-- markdownlint-disable MD024 -->

# Changelog

## [1.5.0] - 2025-04-08

### Added

- Added support for the `query` option to the `configureComponent` method,
  enabling API-based search using the specified query.

## [1.4.0] - 2025-03-12

### Changed

- Added `description` and `component_type` to `V1Component`

## [1.3.3] - 2025-02-5

### Changed

- Add makeProxyRequest function to BaseClient

## [1.3.2] - 2025-02-3

### Changed

- Add getEnvironment function to BaseClient

## [1.3.1] - 2025-01-30

### Changed

- Fix cjs build to transpile and include `oauth4webapi`

## [1.3.0] - 2025-01-30

### Added

- Edge compatible (or closer to it) by replacing `simple-oauth2` with `oauth4webapi`
- Output esm and cjs instead of just cjs
- Minimized bundle size

### Chore

- Modernized package to be type: "module"
- Removed `jest-fetch-mock`

## [1.2.1] - 2025-01-24

### Added

- New types related to API paginated responses
- New type for a prop configuration options

### Changed

- Fixed the types of the trigger retrieval and deployment methods in the backend
  client to correctly reflect the actual response (which is nested inside a
  `data` field).

## [1.2.0] - 2025-01-23

### Added

- New methods and types to interact with the deployed triggers API

## [1.1.6] - 2025-01-21

### Changed

- Fixed the docs of the `getAccountById` method in the backend client to remove
  arguments that are not actually supported.

## [1.1.5] - 2025-01-14

### Changed

- Corrected the return type of `reloadComponentProps`

## [1.1.4] - 2025-01-08

### Added

- Add pagination parameters to component configuration (`page` and `prevContext`)

## [1.1.3] - 2024-12-13

### Added

- Can now filter `getApps` by whether app `hasComponents`,
  `hasActions`, or `hasTriggers` in the registry

## [1.1.2] - 2024-12-12

### Changed

- Fixed the docstring referring to the `componentConfigure` and
  `reloadComponentProps` methods of the components API

## [1.1.1] - 2024-12-11

### Changed

- Remove deprecated asynchronous response handling code.

## [1.1.0] - 2024-12-10

### Added

- Documented the public methods and types for the components API

### Changed

- Renamed the methods involved with the components API (e.g.
  `componentConfigure` -> `configureComponent`)
- Renamed the types used for passing options and accessing responses from the
  components API endpoints (e.g. `ComponentRequestResponse` ->
  `GetComponentResponse`)
- Marked the renamed methods and types as deprecated

## [1.0.12] - 2024-12-06

### Added

- Allow passing `before`, `after` pagination cursors for apps, accounts,
  components endpoints

## [1.0.11] - 2024-12-06

### Added

- Configurable `limit` option for apps, accounts, components endpoints

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

- The backend client now correctly uses asynchronous messaging to handle long
  running operations.
- Updated the backend command line tool to respect the `ENVIRONMENT` env variable
  if set.

## [1.0.6] - 2024-11-20

### Changed

- Use client Connect tokens to make api calls directly from the client.
- Deprecated the `environments` property on `createFrontendClient` since it is
  now stored in the token

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
