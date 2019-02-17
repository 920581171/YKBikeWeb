import request from '@/utils/request'

export function findAllBikeInfo() {
  return request({
    url: '/bikeinfo/findAllBikeInfo',
    method: 'post'
  })
}
