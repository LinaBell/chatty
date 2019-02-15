import React from 'react'
import PropTypes from 'prop-types'
import { FlatList,  StyleSheet } from 'react-native'
import SelectedUser from './SelectedUser'

const SelectedUserList = ({ data, remove }) => (
  <FlatList
    data={data}
    key={({item}) => item.id}
    renderItem={({item}) => <SelectedUser user={item} remove={remove} />}
    horizontal
    style={styles.list}
  />
)

const styles = StyleSheet.create({
  list: {
    paddingVertical: 8,
  },
})

SelectedUserList.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object),
  remove: PropTypes.func,
}

export default SelectedUserList