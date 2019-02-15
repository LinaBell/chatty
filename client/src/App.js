import React, { Component } from 'react'
import { AsyncStorage } from 'react-native'
import { ApolloClient } from 'apollo-client'
import { ApolloLink } from 'apollo-link'
import { ApolloProvider } from 'react-apollo'
import { composeWithDevTools } from 'redux-devtools-extension'
import { createHttpLink } from 'apollo-link-http'
import { createStore, combineReducers, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import { ReduxCache, apolloReducer } from 'apollo-cache-redux'
import { persistStore, persistCombineReducers } from 'redux-persist'
import { InMemoryCache } from 'apollo-cache-inmemory'
import ReduxLink from 'apollo-link-redux'
import { onError } from 'apollo-link-error'
import auth from './reducers/auth'
import thunk from 'redux-thunk'
import { setContext } from 'apollo-link-context'
import AppWithNavigationState, { navigationReducer, navigationMiddleware } from './navigation'

const URL = 'localhost:8080' // set your comp's url here

const config = {
  key: 'root',
  storage: AsyncStorage,
  blacklist: ['nav', 'apollo'], // don't persist nav for now
};

const reducer = persistCombineReducers(config, {
  apollo: apolloReducer,
  nav: navigationReducer,
  auth,
})

const store = createStore(
  reducer,
  {}, // initial state
  composeWithDevTools(
    applyMiddleware(thunk, navigationMiddleware),
  ),
)

const cache = new InMemoryCache()
// const cache = new ReduxCache({ store })
const reduxLink = new ReduxLink(store)
const errorLink = onError((errors) => {
})
const httpLink = createHttpLink({ uri: `http://${URL}` })
const middlewareLink = setContext((req, previousContext) => {
  // get the authentication token from local storage if it exists
  const { jwt } = store.getState().auth
  if (jwt) {
    return {
      headers: {
        authorization: `Bearer ${jwt}`,
      },
    }
  }
  return previousContext
})

const link = ApolloLink.from([
  reduxLink,
  errorLink,
  middlewareLink.concat(httpLink),
])


export const client = new ApolloClient({
  link,
  cache,
})

export default class App extends Component {
  render() {
    return (
      <ApolloProvider client={client}>
        <Provider store={store}>
          <AppWithNavigationState />
        </Provider>
      </ApolloProvider>
    )
  }
}
