const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  adminName: state => state.user.adminName,
  adminPhone: state => state.user.adminPhone,
  adminType: state => state.user.adminType
}
export default getters
