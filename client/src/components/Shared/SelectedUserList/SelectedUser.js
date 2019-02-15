import React from 'react'
import PropTypes from 'prop-types'
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'

const SelectedUser = ({ remove, user }) => {
  return (
    <View
      style={styles.itemContainer}
    >
      <View>
        <Image
          style={styles.itemImage}
          source={{ uri: 'https://reactjs.org/logo-og.png' }}
        />
        <TouchableOpacity onPress={() => remove(user)} style={styles.itemIcon}>
          <Icon
            color="white"
            name="times"
            size={12}
          />
        </TouchableOpacity>
      </View>
      <Text>{user.username}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  itemContainer: {
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  itemIcon: {
    alignItems: 'center',
    backgroundColor: '#dbdbdb',
    borderColor: 'white',
    borderRadius: 10,
    borderWidth: 2,
    flexDirection: 'row',
    height: 20,
    justifyContent: 'center',
    position: 'absolute',
    right: -3,
    top: -3,
    width: 20,
  },
  itemImage: {
    borderRadius: 27,
    height: 54,
    width: 54,
  },
})

SelectedUser.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.number,
    username: PropTypes.string,
  }),
  remove: PropTypes.func,
}

export default SelectedUser