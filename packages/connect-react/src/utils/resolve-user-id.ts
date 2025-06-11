/**
 * Resolves user ID from either externalUserId or userId parameters
 * Prefers externalUserId and returns both the resolved value and warning info
 */
export const resolveUserId = (
  externalUserId?: string, 
  userId?: string
): { resolvedId: string; warningType?: 'both' | 'deprecated' } => {
  if (externalUserId) {
    if (userId) {
      return { resolvedId: externalUserId, warningType: 'both' };
    }
    return { resolvedId: externalUserId };
  }
  
  if (userId) {
    return { resolvedId: userId, warningType: 'deprecated' };
  }
  
  throw new Error('Either externalUserId or userId must be provided');
};