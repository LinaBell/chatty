import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { LOGOUT } from '../constants'
import { NavigationActions, addNavigationHelpers, StackNavigator, TabNavigator } from 'react-navigation'
import { createReduxBoundAddListener, createReactNavigationReduxMiddleware } from 'react-navigation-redux-helpers'
import { connect } from 'react-redux'
import { graphql, compose } from 'react-apollo'
import { REHYDRATE } from 'redux-persist'
import { USER_QUERY } from '../graphql/Queries/Users'
import SignIn from '../components/SignIn'
import Messages from '../components/Messages'
import Groups from '../components/Groups'
import GroupDetails from '../components/Groups/GroupDetails'
import CreateGroup from '../components/Groups/CreateGroup'
import FinalizeGroup from '../components/Groups/FinalizeGroup'

// tabs in main screen
const MainScreenNavigator = TabNavigator({
  SignIn: { screen: SignIn },
  Chats: { screen: Groups },
}, {
  initialRouteName: 'Chats',
})

const AppNavigator = StackNavigator({
  Main: { screen: MainScreenNavigator },
  SignIn: { screen: SignIn },
  Messages: { screen: Messages },
  GroupDetails: { screen: GroupDetails },
  CreateGroup: { screen: CreateGroup },
  FinalizeGroup: { screen: FinalizeGroup },
}, {
  mode: 'modal',
})

// reducer initialization code
const initialState = AppNavigator.router.getStateForAction(NavigationActions.reset({
	index: 0,
	actions: [
	  NavigationActions.navigate({
		  routeName: 'SignIn',
	  }),
	],
}))

// reducer code
export const navigationReducer = (state = initialState, action) => {
  let nextState = AppNavigator.router.getStateForAction(action, state)
  switch (action.type) {
    case REHYDRATE:
      // convert persisted data to Immutable and confirm rehydration
      if (!action.payload || !action.payload.auth || !action.payload.auth.jwt) {
        const { routes, index } = state
        if (routes[index].routeName !== 'Signin') {
          nextState = AppNavigator.router.getStateForAction(
            NavigationActions.navigate({ routeName: 'Signin' }),
            state,
          )
        }
      }
      break
    case LOGOUT:
      const { routes, index } = state
      if (routes[index].routeName !== 'Signin') {
        nextState = AppNavigator.router.getStateForAction(
          NavigationActions.navigate({ routeName: 'Signin' }),
          state,
        )
      }
      break
    default:
      nextState = AppNavigator.router.getStateForAction(action, state)
      break
  }

  // Simply return the original `state` if `nextState` is null or undefined.
  return nextState || state
}

// Note: createReactNavigationReduxMiddleware must be run before createReduxBoundAddListener
export const navigationMiddleware = createReactNavigationReduxMiddleware(
  "root",
  state => state.nav,
)

const addListener = createReduxBoundAddListener("root")

class AppWithNavigationState extends Component {
  render() {
    return (
      <AppNavigator navigation={addNavigationHelpers({
        dispatch: this.props.dispatch,
        state: this.props.nav,
        addListener,
      })} />
    )
  }
}

AppWithNavigationState.propTypes = {
  auth: PropTypes.shape({
    id: PropTypes.number,
    jwt: PropTypes.string,
  }),
  dispatch: PropTypes.func.isRequired,
  nav: PropTypes.object.isRequired,
  refetch: PropTypes.func,
  subscribeToGroups: PropTypes.func,
  subscribeToMessages: PropTypes.func,
  user: PropTypes.shape({
    id: PropTypes.number.isRequired,
    email: PropTypes.string.isRequired,
    groups: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
      }),
    ),
  }),
}

const mapStateToProps = ({ auth, nav }) => ({
  auth,
  nav,
})

const userQuery = graphql(USER_QUERY, {
  skip: ownProps => !ownProps.auth || !ownProps.auth.jwt,
  options: ownProps => ({ variables: { id: ownProps.auth.id } }),
  props: ({ data: { loading, user, refetch } }) => ({
    loading,
    user,
    refetch,
  }),
})

export default compose(
  connect(mapStateToProps),
  userQuery,
)(AppWithNavigationState)