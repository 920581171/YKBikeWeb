<template>
  <div class="app-container">
    <el-table :data="list" v-loading.body="listLoading" element-loading-text="读取中" border fit highlight-current-row>
      <el-table-column align="center" label='序号'>
        <template slot-scope="scope">
          {{scope.$index}}
        </template>
      </el-table-column>
      <el-table-column align="center" label='留言ID'>
        <template slot-scope="scope">
          {{scope.row.messageId}}
        </template>
      </el-table-column>
      <el-table-column align="center" label="用户ID">
        <template slot-scope="scope">
          {{scope.row.senderId}}
        </template>
      </el-table-column>
      <el-table-column align="center" label="留言内容">
        <template slot-scope="scope">
          {{scope.row.messageContent}}
        </template>
      </el-table-column>
      <el-table-column align="center" label="回复内容">
        <template slot-scope="scope">
          {{scope.row.messageReply}}
        </template>
      </el-table-column>
      <el-table-column align="center" label="回复人">
        <template slot-scope="scope">
          {{scope.row.handlerName}}
        </template>
      </el-table-column>
      <el-table-column align="center" label="留言状态">
        <template slot-scope="scope">
          {{scope.row.status}}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button @click="show(scope.row)">
            回复
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose">
      <spen>留言内容：{{messageContent}}</spen>
      <el-form :model="form">
        <el-form-item label="回复内容">
          <el-input v-model="form.messageReply" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="[dialogVisible = false]">取 消</el-button>
    <el-button type="primary" @click="[dialogVisible = false,reply(messageId)]">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { Message } from 'element-ui'
  import { findMessageBroadByType } from '@/api/table'
  import { updateMessageBroad } from '@/api/update'

  export default {
    data() {
      return {
        list: null,
        listLoading: true,
        dialogVisible: false,
        dialogFormVisible: false,
        form: {
          messageReply: ''
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
        'token',
        'adminName'
      ])
    },
    methods: {
      fetchData() {
        this.listLoading = true
        findMessageBroadByType('0').then(response => {
          this.list = response.data
          for (var i = 0; i < response.data.length; i++) {
            this.list[i].status = response.data[i].messageStatus === '0' ? '待回复' : '已回复'
          }
          this.listLoading = false
        })
      },
      show(row) {
        if (row.messageStatus === '1') {
          Message({
            message: '留言已回复',
            type: 'error',
            duration: 3 * 1000
          })
          return
        }
        this.dialogVisible = true
        this.messageId = row.messageId
        this.messageContent = row.messageContent
        this.dialogTitle = '回复留言：' + this.messageId
      },
      reply(messageId) {
        if (this.form.messageReply === '') {
          Message({
            message: '回复内容不能为空',
            type: 'error',
            duration: 3 * 1000
          })
          return
        }
        updateMessageBroad(messageId, this.token, this.adminName, this.form.messageReply).then(response => {
          if (response.code === 1) {
            Message({
              message: '提交成功',
              type: 'success',
              duration: 3 * 1000
            })
            window.location.reload()
          } else {
            Message({
              message: response.msg,
              type: 'error',
              duration: 3 * 1000
            })
          }
        })
        this.form.messageReply = ''
      }
    }
  }
</script>
