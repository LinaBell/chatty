import React, { Component } from 'react'
import {
  StyleSheet,
  TextInput,
  View,
  Button,
} from 'react-native'

class MessageInput extends Component {
  constructor(props) {
    super(props)
    this.state = {}
    this.send = this.send.bind(this)
  }

  send() {
    console.log(this.state.text)
    this.props.send(this.state.text)
    this.textInput.clear()
    this.textInput.blur()
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.inputContainer}>
          <TextInput
            ref={(ref) => { this.textInput = ref }}
            onChangeText={text => this.setState({ text })}
            style={styles.input}
            placeholder="Type your message here!"
          />
        </View>
          <Button title="Send" onPress={this.send} style={styles.sendButton} />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 0,
    alignSelf: 'flex-end',
    backgroundColor: '#f5f1ee',
    borderColor: '#dbdbdb',
    borderTopWidth: 1,
    flexDirection: 'row',
    paddingRight: 20,
  },
  inputContainer: {
    flex: 1,
    paddingHorizontal: 12,
    paddingTop: 4,
    paddingBottom: 30,
  },
  input: {
    backgroundColor: 'white',
    borderColor: '#dbdbdb',
    borderRadius: 15,
    borderWidth: 1,
    color: 'black',
    height: 32,
    paddingHorizontal: 8,
  },
  sendButton: {
    padding: 4,
    fontSize: 12
  },
})

export default MessageInput