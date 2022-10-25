export function create_destination(destination, groupPath) { return `
            mutation {
                externalAuditEventDestinationCreate(input:
                {
                    destinationUrl: "${destination}",
                    groupPath: "${groupPath}",
                    clientMutationId: "PipeDream destination"
                }) 
                {
                    clientMutationId,
                    errors
                    externalAuditEventDestination {
                        destinationUrl
                        group {
                            name
                        }
                    }
                }
            }`;}

export function list_destinations(groupPath) { return `
                query {
                    group(fullPath: "${groupPath}") {
                        id,
                        externalAuditEventDestinations {
                            nodes {
                                destinationUrl,
                                id
                            }
                        }
                    }
                }`;}

export function delete_destination(destinationId) { return `
            mutation {
                externalAuditEventDestinationDestroy(input:
                {
                    id: "${destinationId}"
                }) 
                {
                    errors
                }
            }`;}
