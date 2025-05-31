# Changelog

All notable changes to the Pipedream Python SDK will be documented in this file.

## [1.0.0] - 2024-01-01

### Added
- Initial release of the Pipedream Python SDK
- Complete Python implementation of the Pipedream Connect API
- Support for OAuth and access token authentication
- Account management (CRUD operations)
- App discovery and metadata retrieval
- Component management (triggers and actions)
- Connect token creation for user authentication
- Action execution capabilities
- Trigger deployment and management
- Workflow invocation with various authentication types
- Proxy API for making authenticated requests on behalf of users
- Comprehensive type definitions with dataclasses
- Full test suite and examples
- Zero external dependencies (uses only Python standard library)

### Features
- **Authentication**: OAuth2 and access token support with automatic token refresh
- **Account Management**: Create, read, update, delete operations for connected accounts
- **App Discovery**: Search and retrieve app metadata and capabilities
- **Component Operations**: Configure, reload, and execute components
- **Trigger Management**: Deploy, update, delete, and monitor triggers
- **Workflow Invocation**: Call workflows with different authentication methods
- **Proxy Requests**: Make API calls on behalf of users through Pipedream's proxy
- **Type Safety**: Comprehensive type definitions for all API operations
- **Error Handling**: Proper exception handling for API errors
- **Pagination**: Support for paginated API responses

### Technical Details
- Python 3.8+ compatibility
- Uses only standard library modules (urllib, json, time, etc.)
- Dataclass-based type definitions for better IDE support
- Enum-based constants for better type safety
- Comprehensive docstrings and examples 