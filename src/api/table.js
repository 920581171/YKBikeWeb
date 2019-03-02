import request from '@/utils/request'
import Qs from 'qs'

export function findAllUserInfo() {
  return request({
    url: '/userinfo/findAllUserInfo',
    method: 'post'
  })
}

export function findAllAdminInfo() {
  return request({
    url: '/adminInfo/findAllAdminInfo',
    method: 'post'
  })
}

export function findAllBikeRecord() {
  return request({
    url: 'bikeRecord/findAllBikeRecord',
    method: 'post'
  })
}

export function findMessageBroadByType(messageType) {
  return request({
    url: 'messagebroad/findMessageBroadByType',
    method: 'post',
    data: Qs.stringify({
      messageType
    })
  })
}

export function findDepositRecordByUserId(userId) {
  return request({
    url: '/depositrecord/findDepositRecordByUserId',
    method: 'post',
    data: Qs.stringify({
      userId
    })
  })
}

export function findBalanceRecordByUserId(userId) {
  return request({
    url: 'balancerecord/findBalanceRecordByUserId',
    method: 'post',
    data: Qs.stringify({
      userId
    })
  })
}
