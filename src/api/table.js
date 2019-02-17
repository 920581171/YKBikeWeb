import request from '@/utils/request'

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

