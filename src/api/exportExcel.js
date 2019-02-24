import request from '@/utils/request'

export function exportBikeRecord() {
  return request({
    url: '/common/exportBikeRecord',
    method: 'get'
  })
}
