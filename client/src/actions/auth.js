import { client, wsClient } from '../App'
import { SET_CURRENT_USER, LOGOUT } from '../constants'

export const setCurrentUser = user => ({
  type: SET_CURRENT_USER,
  user,
})

export const logout = () => {
  client.resetStore()
  // wsClient.unsubscribeAll()
  wsClient.close()
  return { type: LOGOUT }
}
