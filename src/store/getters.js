const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  adminName: state => state.user.adminName,
  adminPhone: state => state.user.adminPhone
}
export default getters
