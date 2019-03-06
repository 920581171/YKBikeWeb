import request from '@/utils/request'
import Qs from 'qs'

export function findAllSiteLocation() {
  return request({
    url: '/siteLocation/findAllSiteLocation',
    method: 'post'
  })
}

export function queryPageSiteLocation(pageIndex, pageSize) {
  return request({
    url: 'siteLocation/queryPageSiteLocation',
    method: 'post',
    data: Qs.stringify({
      pageIndex,
      pageSize
    })
  })
}

export function deleteMoreSiteLocation(sites) {
  return request({
    url: 'siteLocation/deleteMoreSiteLocation',
    method: 'post',
    data: Qs.stringify({
      sites: sites.toString()
    })
  })
}
