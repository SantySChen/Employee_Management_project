export function parseErrorMessage(err: unknown): string {
  if (typeof err === 'object' && err !== null && 'response' in err) {
    const axiosErr = err as {
      response?: { data?: { message?: string } }
    }
    return axiosErr.response?.data?.message || 'Unknown error occurred'
  }
  return 'An unexpected error occurred'
}
