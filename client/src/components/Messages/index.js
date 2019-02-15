import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { _ } from 'lodash'
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  View,
  KeyboardAvoidingView,
} from 'react-native'
import randomColor from 'randomcolor'
import { graphql, compose } from 'react-apollo'
import GROUP_QUERY from '../../graphql/Queries/Groups'
import CREATE_MESSAGE_MUTATION from '../../graphql/Mutations/CreateMessage'
import Message from './Message'
import MessageInput from './MessageInput'

class Messages extends Component {
  constructor(props) {
    super(props)
    const usernameColors = {}
    if (props.group && props.group.users) {
      props.group.users.forEach((user) => {
        usernameColors[user.username] = randomColor()
      })
    }
    this.state = {
      usernameColors,
    }
    this.renderItem = this.renderItem.bind(this)
    this.send = this.send.bind(this)
  }

  static navigationOptions = ({ navigation }) => {
    const { state } = navigation
    return {
      title: state.params.title,
    }
  }

  componentWillReceiveProps(nextProps) {
    const usernameColors = {}
    // check for new messages
    if (nextProps.group) {
      if (nextProps.group.users) {
        // apply a color to each user
        nextProps.group.users.forEach((user) => {
          usernameColors[user.username] = this.state.usernameColors[user.username] || randomColor()
        })
      }
      this.setState({
        usernameColors,
      })
    }
  }

  send(text) {
    this.props.createMessage({
      groupId: this.props.navigation.state.params.groupId,
      userId: 1, // faking the user for now
      text,
    }).then(() => {
      this.flatList.scrollToEnd({ animated: true });
    })
    console.log(`sending message: ${text}`)
  }

  keyExtractor = item => item.id.toString()

  renderItem = ({ item: message }) => (
    <Message
      color={this.state.usernameColors[message.from.username] || randomColor()}
      isCurrentUser={message.from.id === 1} // for now until we implement auth
      message={message}
    />
  )

  render() {
    const { loading, group } = this.props
    // render loading placeholder while we fetch messages
    if (loading && !group) {
      return (
        <View style={[styles.loading, styles.container]}>
          <ActivityIndicator />
        </View>
      )
    }

    // render list of messages for group
    return (
      <KeyboardAvoidingView
        behavior={'position'}
        contentContainerStyle={styles.container}
        keyboardVerticalOffset={64}
        style={styles.container}
      >
        <FlatList
          ref={(ref) => { this.flatList = ref }}
          data={group.messages.slice().reverse()}
          // data={fakeData()}
          keyExtractor={this.keyExtractor}
          renderItem={this.renderItem}
          ListEmptyComponent={<View />}
        />
        <MessageInput send={this.send} />
      </KeyboardAvoidingView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'stretch',
    backgroundColor: '#e5ddd5',
    flex: 1,
    flexDirection: 'column',
  },
  loading: {
    justifyContent: 'center',
  },
})

//  Leaving this here for testing n messages in the UI
const fakeData = () => _.times(100, i => ({
  // every message will have a different color
  color: randomColor(),
  // every 5th message will look like it's from the current user
  isCurrentUser: i % 5 === 0,
  message: {
    id: i,
    createdAt: new Date().toISOString(),
    from: {
      username: `Username ${i}`,
    },
    text: `Message ${i}`,
  },
}))

Messages.propTypes = {
  createMessage: PropTypes.func,
  navigation: PropTypes.shape({
    state: PropTypes.shape({
      params: PropTypes.shape({
        groupId: PropTypes.number,
      }),
    }),
  }),
  group: PropTypes.shape({
    messages: PropTypes.array,
    users: PropTypes.array,
  }),
  loading: PropTypes.bool,
}

const groupQuery = graphql(GROUP_QUERY, {
  options: ownProps => ({
    variables: {
      groupId: ownProps.navigation.state.params.groupId,
    },
  }),
  props: ({ data: { loading, group } }) => ({
    loading, group,
  }),
})

const createMessageMutation = graphql(CREATE_MESSAGE_MUTATION, {
  props: ({ mutate }) => ({
    createMessage: ({ text, userId, groupId }) =>
      mutate({
        variables: { text, userId, groupId },
        optimisticResponse: {
          __typename: 'Mutation',
          createMessage: {
            __typename: 'Message',
            id: -1, // don't know id yet, but it doesn't matter
            text, // we know what the text will be
            createdAt: new Date().toISOString(), // the time is now!
            from: {
              __typename: 'User',
              id: 1, // still faking the user
              username: 'Justyn.Kautzer', // still faking the user
            },
            to: {
              __typename: 'Group',
              id: groupId,
            },
          },
        },
        update: (store, { data: { createMessage } }) => {
          // Read the data from our cache for this query.
          const groupData = store.readQuery({
            query: GROUP_QUERY,
            variables: {
              groupId,
            },
          });
          // Add our message from the mutation to the end.
          groupData.group.messages.unshift(createMessage);
          // Write our data back to the cache.
          store.writeQuery({
            query: GROUP_QUERY,
            variables: {
              groupId,
            },
            data: groupData,
          });
        },
      }),
  }),
})

export default compose(
  groupQuery,
  createMessageMutation,
)(Messages)