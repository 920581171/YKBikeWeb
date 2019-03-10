import request from '@/utils/request'
import Qs from 'qs'

export function findAllDepositRecord() {
  return request({
    url: 'depositrecord/findAllDepositRecord',
    method: 'post'
  })
}

export function queryPageDepositRecord(pageIndex, pageSize) {
  return request({
    url: 'depositrecord/queryPageDepositRecord',
    method: 'post',
    data: Qs.stringify({
      pageIndex,
      pageSize
    })
  })
}

export function findAllDateDepositRecord(startTime, endTime) {
  return request({
    url: 'depositrecord/findAllDateDepositRecord',
    method: 'post',
    data: Qs.stringify({
      startTime,
      endTime
    })
  })
}
