import { Message } from 'element-ui'
var websocket

export function initWebSocket(adminId, password, fun) {
  websocket = new WebSocket('ws://127.0.0.1:8080/YKBikeService/WebSocketHandler/' + adminId)
  websocket.onopen = function() {
    Message({
      message: '连接到WebScoket服务器',
      type: 'success',
      duration: 3 * 1000
    })
  }
  websocket.onclose = fun
  websocket.onmessage = function(event) {
    var onMessage = JSON.parse(event.data)
    if (onMessage.type !== 0) {
      return
    }
    var data = {
      loginId: adminId,
      loginType: 'typeAdmin',
      password: password
    }
    var message = {
      type: onMessage.type,
      data: JSON.stringify(data)
    }
    websocket.send(JSON.stringify(message))
  }
}

export function getWebsocket() {
  return websocket
}

export function setWebScoketOnOpen(fun) {
  websocket.onopen = fun
}

export function setWebScoketOnClose(fun) {
  websocket.onclose = fun
}

export function setWebSocketOnMessage(fun) {
  websocket.onmessage = fun
}

export function closeWebSocket() {
  websocket.close()
}
