import { mockApiRequest } from '../data/mockDb'

export async function apiRequest(path, { method = 'GET', body } = {}) {
  return mockApiRequest(path, { method, body })
}
