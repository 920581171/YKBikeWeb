import request from '@/utils/request'

export function findAllSiteLocation() {
  return request({
    url: '/siteLocation/findAllSiteLocation',
    method: 'post'
  })
}
