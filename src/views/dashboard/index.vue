<template>
  <div class="dashboard-container">
    <div class="dashboard-text">管理员：{{adminName}}</div>
    <div class="dashboard-text">手机号：{{adminPhone}}</div>
    <div class="dashboard-text" ref="adminType">权限：</div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  mounted() {
    const adminType = this.$refs.adminType
    adminType.innerHTML = adminType.innerHTML + (this.adminType === '0' ? '系统管理员' : '站点管理员')
  },
  name: 'dashboard',
  computed: {
    ...mapGetters([
      'adminName',
      'adminPhone',
      'adminType'
    ])
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
