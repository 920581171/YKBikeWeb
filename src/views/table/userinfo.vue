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
          <el-button @click="toDeposit(scope.row.userId,scope.row.deposit)">
            {{scope.row.depositText}}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column align="center" label="余额">
        <template slot-scope="scope">
          <el-button @click="toBalance(scope.row.userId)">
            余额（{{scope.row.balance}}）
          </el-button>
        </template>
      </el-table-column>
      <el-table-column align="center" label="积分">
        <template slot-scope="scope">
          <el-button @click="toScore(scope.row.userId)">
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
      width="30%">
      <spen>确定重置用户ID：{{userId}}的密码？</spen>
      <span slot="footer" class="dialog-footer">
    <el-button @click="[dialogResetVisible = false]">取 消</el-button>
    <el-button type="primary" @click="[dialogResetVisible = false,resetPassword(userId)]">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="重置密码"
      :visible.sync="dialogDeleteVisible"
      width="30%">
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

    <el-dialog
      title="重置密码"
      :visible.sync="dialogDepositVisible"
      width="30%">
      <spen>同意用户ID：{{userId}}的退还押金申请？</spen>
      <span slot="footer" class="dialog-footer">
    <el-button @click="[dialogDepositVisible = false]">取 消</el-button>
    <el-button type="primary" @click="[dialogDepositVisible = false,addDeposit(userId)]">同 意</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { findAllUserInfo } from '@/api/table'
  import { resetUserPassword } from '@/api/userinfo'
  import { deleteUserInfo } from '@/api/userinfo'
  import { addDepositRecord } from '@/api/update/'

  export default {
    data() {
      return {
        list: null,
        listLoading: true,
        dialogResetVisible: false,
        dialogDeleteVisible: false,
        dialogDepositVisible: false,
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
          for (var i = 0; i < response.data.length; i++) {
            this.list[i].depositText = response.data[i].deposit < 0 ? '申请退还押金' : '押金（' + response.data[i].deposit + '）'
          }
          this.listLoading = false
        })
      },
      toDeposit(userId, deposit) {
        if (deposit < 0) {
          this.dialogDepositVisible = true
          this.userId = userId
          return
        }
        this.$router.push({ name: 'Deposit', params: { userId: userId }})
      },
      toBalance(userId) {
        this.$router.push({ name: 'Balance', params: { userId: userId }})
      },
      toScore(userId) {
        this.$router.push({ name: 'Score', params: { userId: userId }})
      },
      addDeposit(userId) {
        addDepositRecord(userId, 0).then(response => {
          if (response.code === 1) {
            this.$message({
              message: '退还成功',
              type: 'success',
              duration: 3 * 1000
            })
            this.fetchData()
          } else {
            this.$message({
              message: response.msg,
              type: 'error',
              duration: 3 * 1000
            })
          }
        })
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
            this.fetchData()
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
                message: '删除成功',
                type: 'success',
                duration: 3 * 1000
              })
              this.fetchData()
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
