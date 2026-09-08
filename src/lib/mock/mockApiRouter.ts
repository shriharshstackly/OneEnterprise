import { executeAuthMockRequest } from '@/lib/mock/mockAuthApiRouter'
import type { MockHttpRequest, MockHttpResponse } from '@/lib/mock/mockTypes'

export type { MockHttpRequest, MockHttpResponse }

export async function executeMockApiRequest(
  request: MockHttpRequest & { headers?: Record<string, string> }
): Promise<MockHttpResponse> {
  if (request.path.startsWith('/auth')) {
    return executeAuthMockRequest(request)
  }

  return {
    status: 404,
    body: { success: false, message: `Route not found: ${request.method} ${request.path}` },
  }
}
