export default class SignalingClient {

  constructor(serverUrl, roomId, userId) {
    if (!serverUrl) {
      throw new Error('The signaling server url is mandatory to establish a connection.')
    }

    if (!roomId) {
      throw new Error('You must specify a room to connect to.')
    }

    if (!userId) {
      throw new Error('You must specify a who you are.')
    }

    this.handlers = {}
    this.serverUrl = serverUrl
    this.roomId = roomId
    this.userId = userId

    return this     // make this method chainable
  }

  // open the connection to the signaling server and setup listening
  connect(callback) {
    this.connection = new WebSocket(this.serverUrl)

    this.connection.onopen = () => {

      this.connection.onmessage = (message) => {
        message = this.parseMessage(message.data)

        // if the message is well-formed...
        if ( message && message.event ) {

          // handle it

        // otherwise throw an error
        } else {
          throw new Error('Malformed message.')
        }
      }

      // connect the user to the signaling server

      callback()

    }
  }

  // parse a message that comes from the signaling server to JSON
  parseMessage(message) {
    try { return JSON.parse(message) }
    catch (exception) { return undefined }
  }

  // send a JSON formatted message to the signaling server
  send(message) {
    this.connection.send(JSON.stringify(message))
  }

}
