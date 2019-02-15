import React from 'react'
import PropTypes from 'prop-types'
import { StyleSheet, View, Button } from 'react-native'

const Header = ({ onPress }) => (
  <View style={styles.header}>
    <Button title={'New Group'} onPress={onPress} />
  </View>
)

const styles = StyleSheet.create({
  header: {
    alignItems: 'flex-end',
    padding: 6,
    borderColor: '#eee',
    borderBottomWidth: 1,
  },
})

Header.propTypes = {
  onPress: PropTypes.func.isRequired,
}

export default Header