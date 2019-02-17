import request from '@/utils/request'
import Qs from 'qs'

export function registerAdminInfo(adminAccount, adminName, adminPassword, adminPhone) {
  return request({
    url: '/adminInfo/registerAdminInfo',
    method: 'post',
    data: Qs.stringify({
      adminAccount,
      adminName,
      adminPassword,
      adminPhone
    })
  })
}
