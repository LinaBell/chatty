import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { _ } from 'lodash'
import { connect } from 'react-redux'
import { ActivityIndicator, FlatList, StyleSheet, View } from 'react-native'
import { graphql, compose } from 'react-apollo'
import { USER_QUERY } from '../../graphql/Queries/Users'
import Header from '../Shared/Header'
import Group from './Group'

let IS_SIGNED_IN = false

class Groups extends Component {
  constructor(props) {
    super(props)
    this.goToMessages = this.goToMessages.bind(this)
    this.goToCreateGroup = this.goToCreateGroup.bind(this)
  }

  static navigationOptions = {
    title: 'Chats',
  }

  componentDidMount() {
    if (!IS_SIGNED_IN) {
      IS_SIGNED_IN = true
      this.props.navigation.navigate('SignIn')
    }
  }

  onRefresh() {
    this.props.refetch()
    // faking unauthorized status
  }

  goToCreateGroup() {
    this.props.navigation.navigate('CreateGroup')
  }

  goToMessages(group) {
    this.props.navigation.navigate('Messages', { groupId: group.id, title: group.name })
  }

  keyExtractor = item => item.id.toString()
  renderItem = ({ item }) => <Group group={item} goToMessages={this.goToMessages} />

  render() {
    const { loading, user } = this.props
    if (loading || !user) {
      return (
        <View style={[styles.loading, styles.container]}>
          <ActivityIndicator />
        </View>
      )
    }

    return (
      <View style={styles.container}>
        <Header onPress={this.goToCreateGroup} />
        <FlatList
          data={user.groups}
          keyExtractor={this.keyExtractor}
          renderItem={this.renderItem}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
  },
  loading: {
    justifyContent: 'center',
    flex: 1,
  },
})


Groups.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }),
  loading: PropTypes.bool,
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

const userQuery = graphql(USER_QUERY, {
  skip: ownProps => !ownProps.auth || !ownProps.auth.jwt,
  options: ownProps => ({ variables: { id: ownProps.auth.id } }),
  props: ({ data: { loading, networkStatus, refetch, user } }) => ({
    loading, networkStatus, refetch, user,
  }),
})

const mapStateToProps = ({ auth }) => ({
  auth,
})

export default compose(
  connect(mapStateToProps),
  userQuery,
)(Groups)