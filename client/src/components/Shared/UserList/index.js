import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Image, Text, View, StyleSheet } from 'react-native'
import AlphabetListView from 'react-native-alpha-listview'
import Icon from 'react-native-vector-icons/FontAwesome'

const SectionHeader = ({ title }) => (
  <View style={{backgroundColor: '#ccc'}}>
    <Text style={styles.textStyle}>{title}</Text>
  </View>
)
SectionHeader.propTypes = {
  title: PropTypes.string,
}

const SectionItem = ({ title }) => (
  <Text style={{ color: 'blue' }}>{title}</Text>
)
SectionItem.propTypes = {
  title: PropTypes.string,
}

class Cell extends Component {
  constructor(props) {
    super(props)
    this.toggle = this.toggle.bind(this)
    this.state = {
      isSelected: props.isSelected(props.item),
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      isSelected: nextProps.isSelected(nextProps.item),
    })
  }

  toggle() {
    this.props.toggle(this.props.item)
  }

  render() {
    return (
      <View style={styles.cellContainer}>
        <Image
          style={styles.cellImage}
          source={{ uri: 'https://reactjs.org/logo-og.png' }}
        />
        <Text style={styles.cellLabel}>{this.props.item.username}</Text>
        <View style={styles.checkButtonContainer}>
          <Icon.Button
            backgroundColor={this.state.isSelected ? 'blue' : 'white'}
            borderRadius={12}
            color={'white'}
            iconStyle={styles.checkButtonIcon}
            name={'check'}
            onPress={this.toggle}
            size={16}
            style={styles.checkButton}
          />
        </View>
      </View>
    )
  }
}

Cell.propTypes = {
  isSelected: PropTypes.func,
  item: PropTypes.shape({
    username: PropTypes.string.isRequired,
  }).isRequired,
  toggle: PropTypes.func.isRequired,
}

const UserList = ({ users, isSelected, toggle }) => (
  <AlphabetListView
    style={{ flex: 0 }}
    data={users}
    cell={Cell}
    cellHeight={30}
    cellProps={{
      isSelected: isSelected,
      toggle: toggle,
    }}
    sectionListItem={SectionItem}
    sectionHeader={SectionHeader}
    sectionHeaderHeight={22.5}
  />
)

UserList.propTypes = {
  isSelected: PropTypes.func,
  friends: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    username: PropTypes.string,
  })),
  toggle: PropTypes.func.isRequired,
}

const styles = StyleSheet.create({
  textStyle: {
    textAlign: 'center',
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  cellContainer: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  cellImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  cellLabel: {
    flex: 1,
    fontSize: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  checkButtonContainer: {
    paddingRight: 12,
    paddingVertical: 6,
  },
  checkButton: {
    borderWidth: 1,
    borderColor: '#dbdbdb',
    padding: 4,
    height: 24,
    width: 24,
  },
  checkButtonIcon: {
    marginRight: -4, // default is 12
  },
})

export default UserList