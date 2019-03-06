import request from '@/utils/request'
import Qs from 'qs'

export function findAllBikeInfo() {
  return request({
    url: '/bikeinfo/findAllBikeInfo',
    method: 'post'
  })
}

export function updateBikeLocation(bikeId, latitude, longitude) {
  return request({
    url: '/bikeinfo/updateBikeLocation',
    method: 'post',
    data: Qs.stringify({
      bikeId,
      latitude,
      longitude
    })
  })
}

export function queryPageBikeInfo(pageIndex, pageSize) {
  return request({
    url: 'bikeinfo/queryPageBikeInfo',
    method: 'post',
    data: Qs.stringify({
      pageIndex,
      pageSize
    })
  })
}

export function deleteMoreBikeInfo(bikeIds) {
  return request({
    url: 'bikeinfo/deleteMoreBikeInfo',
    method: 'post',
    data: Qs.stringify({
      bikeIds: bikeIds.toString()
    })
  })
}
