# Prisma Management API

The Prisma Management API interacts seamlessly with Pipedream, empowering you to craft customized automations and workflows for your Prisma Postgres databases. Create projects, manage databases, and handle connection strings with ease.

## Overview

The Prisma Management API provides programmatic access to manage Prisma Postgres database projects. This integration allows you to automate database lifecycle management, connection string generation, and resource provisioning within your Pipedream workflows.

With this integration, you can:

- **Automate Database Provisioning**: Automatically create new Postgres database projects with proper regional distribution
- **Manage Connection Strings**: Generate and manage secure connection strings for your applications
- **Monitor Resources**: List and inspect databases, projects, and connection details across your workspace
- **Streamline Cleanup**: Systematically remove databases and connection strings when no longer needed

## Getting Started

To use the Prisma Management API with Pipedream, you'll need to connect your Prisma account and obtain an API integration token.

## Actions

### Project Management

#### Create Database
Creates a new Postgres database project via Prisma Management API. This action creates a complete project with database and provides connection string details in the response for immediate use.

**Parameters:**
- `name` (string, required): The name of the Postgres database project to create
- `region` (string, optional): The region where the database should be created (default: us-east-1)

**Available regions:** us-east-1, us-west-1, eu-west-3, eu-central-1, ap-northeast-1, ap-southeast-1

#### List Projects in Prisma Workspace
Retrieves all projects within your Prisma workspace.

#### Get Project Details
Retrieves detailed information about a specific project including associated databases and configuration.

**Parameters:**
- `projectId` (string, required): The ID of the project to retrieve

#### Delete Database
Removes an entire Postgres database project and all associated resources.

**Parameters:**
- `projectId` (string, required): The ID of the project to delete

### Database Management

#### Create New Database in Existing Project
Adds a new database to an existing Prisma project.

**Parameters:**
- `projectId` (string, required): The ID of the project where the database should be created
- `region` (string, optional): The region for the database
- `isDefault` (boolean, optional): Whether to set this as the default database for the project

#### List Databases from Project
Retrieves all databases within a specific project.

**Parameters:**
- `projectId` (string, required): The ID of the project

#### Get Database Details
Retrieves detailed information about a specific Prisma Postgres database.

**Parameters:**
- `databaseId` (string, required): The ID of the database

#### Delete Database by Database ID
Removes a specific database by its ID.

**Parameters:**
- `databaseId` (string, required): The ID of the database to delete

### Connection String Management

#### Create Database Connection String
Generates a new connection string for database access.

**Parameters:**
- `databaseId` (string, required): The ID of the database
- `name` (string, required): A descriptive name for the connection

#### List Database Connection Strings
Retrieves all connection strings for a specific database.

**Parameters:**
- `databaseId` (string, required): The ID of the database

#### Delete Database Connection String
Removes a specific connection string.

**Parameters:**
- `connectionId` (string, required): The ID of the connection to delete

### Utilities

#### Get Prisma Postgres Regions
Retrieves the list of available regions for Prisma Postgres deployment.

## Authentication

This integration uses API Token authentication. You'll need to provide your Prisma Management API Service token when configuring the connection in Pipedream.

To obtain your API token:
1. Log in to your Prisma account
2. Navigate to your workspace settings
3. Generate a new Service Token 
4. Copy the token for use in Pipedream

## API Documentation

For complete API documentation and additional details, visit the [Prisma Management API Documentation](https://www.prisma.io/docs/postgres/introduction/management-api).

## Example Workflows

### Automated Database Setup for New Projects
Trigger a workflow when a new project is created in your system, automatically provision a Prisma Postgres database, and store the connection details in your configuration management system.

### Database Cleanup Automation
Schedule periodic cleanup of unused databases and connection strings to maintain security and reduce costs.

### Multi-Region Database Deployment
Create databases across multiple regions for improved performance and redundancy based on your application's geographic distribution.

## Support

For issues specific to the Prisma Management API, refer to the [official documentation](https://www.prisma.io/docs/postgres/introduction/management-api).

For Pipedream-related questions, visit the [Pipedream documentation](https://pipedream.com/docs) or community forums.