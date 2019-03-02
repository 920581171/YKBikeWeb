<template>
  <div class="app-container">
    <el-table :data="list" v-loading.body="listLoading" element-loading-text="读取中" border fit highlight-current-row>
      <el-table-column align="center" label='序号'>
        <template slot-scope="scope">
          {{scope.$index}}
        </template>
      </el-table-column>
      <el-table-column align="center" label='用户ID'>
        <template slot-scope="scope">
          {{scope.row.userId}}
        </template>
      </el-table-column>
      <el-table-column align="center" label="用户账号">
        <template slot-scope="scope">
          {{scope.row.userName}}
        </template>
      </el-table-column>
      <el-table-column align="center" label="联系电话">
        <template slot-scope="scope">
          {{scope.row.userPhone}}
        </template>
      </el-table-column>
      <el-table-column align="center" label="押金">
        <template slot-scope="scope">
          <el-button @click="deposit(scope.row.userId)">
            押金（{{scope.row.deposit}}）
          </el-button>
        </template>
      </el-table-column>
      <el-table-column align="center" label="余额">
        <template slot-scope="scope">
          <el-button @click="balance(scope.row.userId)">
            余额（{{scope.row.balance}}）
          </el-button>
        </template>
      </el-table-column>
      <el-table-column align="center" label="积分">
        <template slot-scope="scope">
          <el-button @click="score(scope.row.userId)">
            积分（{{scope.row.score}}）
          </el-button>
        </template>
      </el-table-column>
      <el-table-column align="center" label="密码操作">
        <template slot-scope="scope">
          <el-button @click="checkResetPower(scope.row.userId)">
            重置密码
          </el-button>
        </template>
      </el-table-column>
        <el-table-column align="center" label="用户操作">
          <template slot-scope="scope">
        <el-button @click="checkDeletePower(scope.row.userId)">
          删除用户
        </el-button>
          </template>
      </el-table-column>
    </el-table>

    <el-dialog
      title="重置密码"
      :visible.sync="dialogResetVisible"
      width="30%"
      :before-close="handleClose">
      <spen>确定重置用户ID：{{userId}}的密码？</spen>
      <span slot="footer" class="dialog-footer">
    <el-button @click="[dialogResetVisible = false]">取 消</el-button>
    <el-button type="primary" @click="[dialogResetVisible = false,resetPassword(userId)]">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="重置密码"
      :visible.sync="dialogDeleteVisible"
      width="30%"
      :before-close="handleClose">
      <el-form :model="form">
        <el-form-item label="请确认将要删除的用户ID">
          <el-input v-model="form.userId" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="[dialogDeleteVisible = false]">取 消</el-button>
    <el-button type="primary" @click="[dialogDeleteVisible = false,del(userId)]">确 定</el-button>
    </span>
    </el-dialog>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { findAllUserInfo } from '@/api/table'
  import { resetUserPassword } from '@/api/userinfo'
  import { deleteUserInfo } from '@/api/userinfo'

  export default {
    data() {
      return {
        list: null,
        listLoading: true,
        dialogResetVisible: false,
        dialogDeleteVisible: false,
        form: {
          userId: ''
        }
      }
    },
    filters: {
      statusFilter(status) {
        const statusMap = {
          published: 'success',
          draft: 'gray',
          deleted: 'danger'
        }
        return statusMap[status]
      }
    },
    created() {
      this.fetchData()
    },
    computed: {
      ...mapGetters([
        'adminType'
      ])
    },
    methods: {
      fetchData() {
        this.listLoading = true
        findAllUserInfo().then(response => {
          this.list = response.data
          this.listLoading = false
        })
      },
      deposit(userId) {
        this.$router.push({ name: 'Deposit', params: { userId: userId }})
      },
      balance(userId) {
        this.$router.push({ name: 'Balance', params: { userId: userId }})
      },
      score(userId) {
        this.$router.push({ name: 'Score', params: { userId: userId }})
      },
      checkResetPower(userId) {
        if (this.adminType === '1') {
          this.$message({
            message: '权限不够',
            type: 'error',
            duration: 3 * 1000
          })
        } else {
          this.dialogResetVisible = true
          this.userId = userId
        }
      },
      checkDeletePower(userId) {
        if (this.adminType === '1') {
          this.$message({
            message: '权限不够',
            type: 'error',
            duration: 3 * 1000
          })
        } else {
          this.dialogDeleteVisible = true
          this.userId = userId
        }
      },
      resetPassword(userId) {
        resetUserPassword(userId).then(response => {
          if (response.code === 1) {
            this.$message({
              message: '重置成功',
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
      del(userId) {
        if (userId === this.form.userId) {
          deleteUserInfo(userId).then(response => {
            if (response.code === 1) {
              this.$message({
                message: '用户已删除',
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
        } else {
          this.$message({
            message: '用户ID不匹配',
            type: 'error',
            duration: 3 * 1000
          })
        }
      }
    }
  }
</script>
