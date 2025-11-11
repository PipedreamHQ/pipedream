# Sage CRM API Client Implementation

## Why
This PR introduces a modern Python client for interacting with Sage CRM's REST API, providing a more maintainable and type-safe way to manage tickets and other CRM entities. The implementation follows Python best practices and includes comprehensive error handling and rate limiting.

## What's New
- Modern Python client for Sage CRM API with type hints (Python 3.8+)
- Comprehensive error handling with custom exceptions
- Built-in rate limiting to prevent API abuse
- Input validation and type checking
- Detailed logging for debugging
- Example usage with environment variables

## Implementation Details

### Core Features
- **Authentication**: Secure Basic Auth with proper credential handling
- **Rate Limiting**: Configurable request throttling (default: 10 requests/second)
- **Error Handling**:
  - Custom exceptions for common error cases
  - Detailed error messages with context
  - Proper HTTP status code handling

### API Methods
- `get_tickets()`: List tickets with optional filtering
- `get_ticket()`: Retrieve a single ticket by ID
- `create_ticket()`: Create new tickets
- `update_ticket()`: Modify existing tickets
- `delete_ticket()`: Remove tickets

### Development Setup
1. Install dependencies:
   ```bash
   pip install requests python-dotenv
   ```

2. Set up environment variables (`.env` file):
   ```
   SAGE_CRM_URL=https://your-company.crm.sage.com
   SAGE_CRM_USERNAME=your_username
   SAGE_CRM_PASSWORD=your_password
   ```

3. Run the example:
   ```bash
   python sage_crm_client.py
   ```

## Testing
The implementation includes example usage in the `__main__` block that demonstrates:
- Listing open tickets
- Creating a new ticket
- Updating the ticket status
- Error handling for common scenarios

## Security
- Credentials are never logged
- HTTPS is enforced for all API requests
- Rate limiting prevents accidental API abuse

## Future Improvements
- Add support for more Sage CRM entities
- Implement pagination for large result sets
- Add async/await support
- Include unit tests and CI/CD pipeline
