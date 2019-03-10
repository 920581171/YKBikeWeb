import request from '@/utils/request'
import Qs from 'qs'

export function findAllBikeRecord() {
  return request({
    url: 'bikeRecord/findAllBikeRecord',
    method: 'post'
  })
}

export function queryPageBikeRecord(pageIndex, pageSize) {
  return request({
    url: 'bikeRecord/queryPageBikeRecord',
    method: 'post',
    data: Qs.stringify({
      pageIndex,
      pageSize
    })
  })
}

export function findAllDateBikeRecord(startTime, endTime) {
  return request({
    url: 'bikeRecord/findAllDateBikeRecord',
    method: 'post',
    data: Qs.stringify({
      startTime,
      endTime
    })
  })
}
