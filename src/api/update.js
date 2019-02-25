import request from '@/utils/request'
import Qs from 'qs'

export function updateMessageBroad(messageId, handlerId, handlerName, messageReply) {
  return request({
    url: '/messagebroad/updateMessageBroad',
    method: 'post',
    data: Qs.stringify({
      messageId,
      handlerId,
      handlerName,
      messageReply
    })
  })
}
