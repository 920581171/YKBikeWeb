<template>
  <div class="app-container">
    <el-form ref="form" :model="form" label-width="120px">
      <el-form-item label="管理员姓名">
        <el-input v-model="form.adminName" style="width: 256px;"></el-input>
      </el-form-item>
      <el-form-item label="登录账号">
        <el-input v-model="form.adminAccount" style="width: 256px;"></el-input>
      </el-form-item>
      <el-form-item label="登录密码">
        <el-input type="password" v-model="form.adminPassword" style="width: 256px;"></el-input>
      </el-form-item>
      <el-form-item label="确认密码">
        <el-input type="password" v-model="form.adminPasswordConfirm" style="width: 256px;"></el-input>
      </el-form-item>
      <el-form-item label="联系电话">
        <el-input v-model="form.adminPhone" style="width: 256px;"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">创建</el-button>
        <el-button @click="onCancel">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { registerAdminInfo } from '@/api/admininfo'

  export default {
    data() {
      return {
        form: {
          adminName: '',
          adminAccount: '',
          adminPassword: '',
          adminPasswordConfirm: '',
          adminPhone: ''
        }
      }
    },
    mounted() {
      if (this.adminType === '1') {
        this.$router.push({ path: '/' })
        this.$message({
          message: '权限不够',
          type: 'error',
          duration: 3 * 1000
        })
      }
    },
    computed: {
      ...mapGetters([
        'adminType'
      ])
    },
    methods: {
      onSubmit() {
        if (this.form.adminName === '') {
          this.$message({
            message: '管理员姓名不能为空',
            type: 'error',
            duration: 3 * 1000
          })
          return
        }
        if (this.form.adminAccount === '') {
          this.$message({
            message: '登陆账号不能为空',
            type: 'error',
            duration: 3 * 1000
          })
          return
        }
        if (this.form.adminPassword.trim().length < 8) {
          this.$message({
            message: '密码不能少于8位',
            type: 'error',
            duration: 3 * 1000
          })
          return
        }
        if (this.form.adminPassword === '') {
          this.$message({
            message: '登陆密码不能为空',
            type: 'error'
          })
          return
        }
        if (this.form.adminPassword !== this.form.adminPasswordConfirm) {
          this.$message({
            message: '两次密码不相同',
            type: 'error',
            duration: 3 * 1000
          })
          return
        }
        if (this.form.adminPasswordConfirm === '') {
          this.$message({
            message: '确认密码不能为空',
            type: 'error',
            duration: 3 * 1000
          })
          return
        }
        if (this.form.adminPhone === '') {
          this.$message({
            message: '联系电话不能为空',
            type: 'error'
          })
          return
        }
        if (!this.checkPhone(this.form.adminPhone)) {
          this.$message({
            message: '联系电话不合法',
            type: 'error',
            duration: 3 * 1000
          })
          return
        }
        registerAdminInfo(this.form.adminAccount,
          this.form.adminName,
          this.form.adminPassword,
          this.form.adminPhone
        ).then(response => {
          if (response.code === 1) {
            this.$message({
              message: '添加成功',
              type: 'success',
              duration: 3 * 1000
            })
          } else {
            this.$message({
              message: response.msg,
              type: 'error',
              duration: 3 * 1000
            })
          }
        })
      },
      onCancel() {
        this.form.adminAccount = ''
        this.form.adminName = ''
        this.form.adminPassword = ''
        this.form.adminPasswordConfirm = ''
        this.form.adminPhone = ''
      },
      checkPhone(mobile) {
        var tel = /^0\d{2,3}-?\d{7,8}$/
        var phone = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/
        if (mobile.length === 11) { // 手机号码
          if (phone.test(mobile)) {
            return true
          }
        } else if (mobile.length === 13 && mobile.indexOf('-') !== -1) { // 电话号码
          if (tel.test(mobile)) {
            return true
          }
        }
        return false
      }
    }
  }
</script>

<style scoped>
  .line {
    text-align: center;
  }
</style>

