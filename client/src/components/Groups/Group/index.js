import React from 'react'
import PropTypes from 'prop-types'
import {
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from 'react-native'

const Group = ({ group, goToMessages }) => (
  <TouchableHighlight
    key={group.id}
    onPress={() => goToMessages(group)}
  >
    <View style={styles.groupContainer}>
      <Text style={styles.groupName}>{`${group.name}`}</Text>
    </View>
  </TouchableHighlight>
)

const styles = StyleSheet.create({
  groupContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  groupName: {
    fontWeight: 'bold',
    flex: 0.7,
  },
})

Group.propTypes = {
  group: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
  }),
  goToMessages: PropTypes.func.isRequired,
}

export default Group