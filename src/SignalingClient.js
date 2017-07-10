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

}
