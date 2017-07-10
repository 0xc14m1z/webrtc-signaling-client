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
          this.handle(message)

        // otherwise throw an error
        } else {
          throw new Error('Malformed message.')
        }
      }

      // connect the user to the signaling server
      this.send({ command: 'connect', roomId: this.roomId, userId: this.userId })

      callback()

    }
  }

  // allow users of this class to listen for specific events
  on(event, callback) {
    this.handlers[event] = callback
    return this   // make this method chainable
  }

  // handle messages coming from the signaling server
  handle(message) {
    const { event } = message
    const callback = this.handlers[event]

    if ( callback ) {
      switch ( event ) {
        case 'connected': {
          const { user } = message
          callback(user)
          break
        }
        case 'connectionRequest': {
          const { user, sessionDescription } = message
          callback(user, sessionDescription)
          break
        }
        case 'connectionAccepted': {
          const { user, sessionDescription } = message
          callback(user, sessionDescription)
          break
        }
        case 'candidateProposal': {
          const { user, iceCandidate } = message
          callback(user, iceCandidate)
          break
        }
        case 'disconnected': {
          const { roomId, disconnectedUserId, users } = message
          callback(roomId, disconnectedUserId, users)
          break
        }
        default: {
          throw new Error('Unrecognizable event.')
        }
      }
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
