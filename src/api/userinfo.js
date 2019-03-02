import request from '@/utils/request'
import Qs from 'qs'

export function resetUserPassword(userId) {
  return request({
    url: '/userinfo/resetUserPassword',
    method: 'post',
    data: Qs.stringify({
      userId
    })
  })
}

export function deleteUserInfo(userId) {
  return request({
    url: '/userinfo/deleteUserInfo',
    method: 'post',
    data: Qs.stringify({
      userId
    })
  })
}
