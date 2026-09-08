export interface MockHttpRequest {
  method: string
  path: string
  query?: Record<string, string>
  body?: unknown
  headers?: Record<string, string>
}

export interface MockHttpResponse {
  status: number
  body: {
    success: boolean
    data?: unknown
    message: string
  }
}
