import request from '@/utils/request'
import Qs from 'qs'

export function findAllBalanceRecord() {
  return request({
    url: 'balancerecord/findAllBalanceRecord',
    method: 'post'
  })
}

export function queryPageBalanceRecord(pageIndex, pageSize) {
  return request({
    url: 'balancerecord/queryPageBalanceRecord',
    method: 'post',
    data: Qs.stringify({
      pageIndex,
      pageSize
    })
  })
}

export function findAllDateBalanceRecord(startTime, endTime) {
  return request({
    url: 'balancerecord/findAllDateBalanceRecord',
    method: 'post',
    data: Qs.stringify({
      startTime,
      endTime
    })
  })
}
