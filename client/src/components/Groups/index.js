import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { _ } from 'lodash'
import { FlatList, StyleSheet, View } from 'react-native'
import Group from './Group'

class Groups extends Component {
  constructor(props) {
    super(props)
    this.goToMessages = this.goToMessages.bind(this)
  }

  static navigationOptions = {
    title: 'Chats',
  }
  keyExtractor = item => item.id.toString()

  goToMessages(group) {
    const { navigate } = this.props.navigation
    navigate('Messages', { groupId: group.id, title: group.name })
  }

  renderItem = ({ item }) => <Group group={item} goToMessages={this.goToMessages} />

  render() {
    return (
      <View style={styles.container}>
        <FlatList
          data={fakeData()}
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
})

// create fake data to populate our ListView
const fakeData = () => _.times(100, i => ({
  id: i,
  name: `Group ${i}`,
}))

Groups.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }),
}

export default Groups