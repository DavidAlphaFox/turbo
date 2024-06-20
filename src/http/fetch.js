import { uuid } from "../util"
import { LimitedSet } from "../core/drive/limited_set"

export const recentRequests = new LimitedSet(20)

const nativeFetch = window.fetch
//在fetch外层进行wrap
function fetchWithTurboHeaders(url, options = {}) {
  const modifiedHeaders = new Headers(options.headers || {})
  const requestUID = uuid()
  recentRequests.add(requestUID)
  modifiedHeaders.append("X-Turbo-Request-Id", requestUID)

  return nativeFetch(url, {
    ...options,
    headers: modifiedHeaders
  })
}

export { fetchWithTurboHeaders as fetch }
