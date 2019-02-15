import request from '@/utils/request'
import Qs from 'qs'

export function login(adminAccountOrPhone, adminPassword) {
  return request({
    url: '/adminInfo/appAdminLogin',
    method: 'post',
    data: Qs.stringify({
      adminAccountOrPhone,
      adminPassword
    })
  })
}

export function getInfo(adminId) {
  return request({
    url: '/adminInfo/findAdminByAdminId',
    method: 'post',
    data: Qs.stringify({
      adminId
    })
  })
}

export function logout() {
  return request({
    url: '/adminInfo/findAllAdminInfo',
    method: 'post'
  })
}
