import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  ActivityIndicator,
  Button,
  StyleSheet,
  View,
} from 'react-native'
import { _ } from 'lodash'
import { graphql, compose } from 'react-apollo'
import update from 'immutability-helper'
import { connect } from 'react-redux'
import USER_QUERY from '../../../graphql/Queries/Users'
import UserList from '../../Shared/UserList'
import SelectedUserList from '../../Shared/SelectedUserList'

// eslint-disable-next-line
const sortObject = o => Object.keys(o).sort().reduce((r, k) => (r[k] = o[k], r), {})

class CreateGroup extends Component {
  constructor(props) {
    super(props)
    let selected = []
    if (this.props.navigation.state.params) {
      selected = this.props.navigation.state.params.selected
    }
    this.state = {
      selected: selected || [],
      friends: props.user ?
        _.groupBy(props.user.friends, friend => friend.username.charAt(0).toUpperCase()) : [],
    }
    this.finalizeGroup = this.finalizeGroup.bind(this)
    this.isSelected = this.isSelected.bind(this)
    this.toggle = this.toggle.bind(this)
  }

  static navigationOptions = ({ navigation }) => {
    const isReady = navigation.params && navigation.params.mode === 'ready'
    return {
      title: 'New Group',
      headerRight: (
        isReady ? <Button
          title="Next"
          onPress={navigation.params.finalizeGroup}
        /> : undefined
      ),
    }
  }

  componentDidMount() {
    this.refreshNavigation(this.state.selected)
  }

  componentWillReceiveProps(nextProps) {
    const state = {}
    if (nextProps.user && nextProps.user.friends && nextProps.user !== this.props.user) {
      state.friends = sortObject(
        _.groupBy(nextProps.user.friends, friend => friend.username.charAt(0).toUpperCase()),
      )
    }

    if (nextProps.selected) {
      Object.assign(state, {
        selected: nextProps.selected,
      })
    }

    this.setState(state)
  }

  componentWillUpdate(nextProps, nextState) {
    if (!!this.state.selected.length !== !!nextState.selected.length) {
      this.refreshNavigation(nextState.selected)
    }
  }

  refreshNavigation(selected) {
    const { navigation } = this.props
    navigation.setParams({
      mode: selected && selected.length ? 'ready' : undefined,
      finalizeGroup: this.finalizeGroup,
    })
  }

  finalizeGroup() {
    this.props.navigation.navigate('FinalizeGroup', {
      selected: this.state.selected,
      friendCount: this.props.user.friends.length,
      userId: this.props.user.id,
    })
  }

  isSelected(user) {
    console.log(user)
    return ~this.state.selected.indexOf(user)
  }

  toggle(user) {
    const index = this.state.selected.indexOf(user)
    let selected
    if(index === -1) selected = [...this.state.selected, user]
    else selected = update(this.state.selected, { $splice: [[index, 1]] })
    return this.setState({ selected })
  }

  render() {
    const { user, loading } = this.props

    // render loading placeholder while we fetch messages
    if (loading || !user) {
      return (
        <View style={[styles.loading, styles.container]}>
          <ActivityIndicator />
        </View>
      )
    }

    return (
      <View style={styles.container}>
        {this.state.selected.length ?
          <View style={styles.selected}>
            <SelectedUserList
              data={this.state.selected}
              remove={this.toggle}
            />
          </View>
        : undefined}
        {_.keys(this.state.friends).length ?
          <UserList users={this.state.friends} isSelected={this.isSelected} toggle={this.toggle} />
        : undefined}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  selected: {
    flexDirection: 'row',
  },
  loading: {
    justifyContent: 'center',
    flex: 1,
  },
})

CreateGroup.propTypes = {
  loading: PropTypes.bool.isRequired,
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
    setParams: PropTypes.func,
    state: PropTypes.shape({
      params: PropTypes.object,
    }),
  }),
  user: PropTypes.shape({
    id: PropTypes.number,
    friends: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number,
      username: PropTypes.string,
    })),
  }),
  selected: PropTypes.arrayOf(PropTypes.object),
}

const userQuery = graphql(USER_QUERY, {
  options: ownProps => ({ variables: { id: ownProps.auth.id } }),
  props: ({ data: { loading, user } }) => ({
    loading, user,
  }),
})

const mapStateToProps = ({ auth }) => ({
  auth,
})

export default compose(
  connect(mapStateToProps),
  userQuery,
)(CreateGroup)