<template>
  <div class="app-container">
    <el-checkbox-group v-model="checkList">
    <el-table :data="list" v-loading.body="listLoading" element-loading-text="读取中" border fit highlight-current-row>
      <el-table-column align="center" label='序号'>
        <template slot-scope="scope">
          <el-checkbox :label=scope.row.bikeId :disabled="disabled[scope.row.index]">{{scope.row.index}}</el-checkbox>
        </template>
      </el-table-column>
      <el-table-column align="center" label='车辆ID'>
        <template slot-scope="scope">
          {{scope.row.bikeId}}
        </template>
      </el-table-column>
      <el-table-column align="center" label='车辆类型'>
        <template slot-scope="scope">
          {{scope.row.bikeTypeText}}
        </template>
      </el-table-column>
      <el-table-column align="center" label='每10分钟价格（元）'>
        <template slot-scope="scope">
          {{scope.row.unitPrice}}
        </template>
      </el-table-column>
      <el-table-column align="center" label='纬度'>
        <template slot-scope="scope">
          {{scope.row.latitude}}
        </template>
      </el-table-column>
      <el-table-column align="center" label="经度" >
        <template slot-scope="scope">
          {{scope.row.longitude}}
        </template>
      </el-table-column>
      <el-table-column  align="center" label="状态">
        <template slot-scope="scope">
          {{scope.row.sta}}
        </template>
      </el-table-column>
    </el-table>
    </el-checkbox-group>
    <br>
    <div style="float: left">
      <el-button @click="selectAll">全选</el-button>
      <el-button @click="deleteBike">批量删除所选项</el-button>
      <el-button @click="showCreate">批量生成二维码</el-button>
    </div>
    <div style="float: right">
      <el-pagination
        @current-change="changePage"
        :current-page.sync="currentPage"
        page-size="5"
        layout="prev, pager, next"
        :total="size">
      </el-pagination>
    </div>

    <el-dialog
      title="批量生成二维码"
      :visible.sync="dialogQRCodeVisible"
      width="30%">
      <el-select v-model="value" placeholder="请选择车辆类型">
        <el-option
          v-for="item in options"
          :key="item.typeValue"
          :label="item.typeName"
          :value="item.typeValue">
          <span style="float: left">{{ item.typeName}}</span>
          <span style="float: right; color: #8492a6; font-size: 13px">{{ item.unitPrice }}元/10分钟</span>
        </el-option>
      </el-select>
      <el-form :model="form">
        <el-form-item label="请递增输入ID范围">
          <el-input v-model="form.startNum" autocomplete="off"></el-input>
          <el-input v-model="form.endNum" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="[dialogQRCodeVisible = false]">取 消</el-button>
    <el-button type="primary" @click="[dialogQRCodeVisible = false,createQRCode()]">生 成</el-button>
    </span>
    </el-dialog>

    <el-dialog
      title="删除车辆"
      :visible.sync="dialogVisible"
      width="30%">
      <spen>确定删除：{{checkList.toString()}}车辆？</spen>
      <span slot="footer" class="dialog-footer">
    <el-button @click="[dialogVisible = false]">取 消</el-button>
    <el-button type="primary" @click="[dialogVisible = false,deleteMore(checkList)]">删 除</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { Message } from 'element-ui'
import { mapGetters } from 'vuex'
import { findAllBikeInfo } from '@/api/bikeInfo'
import { queryPageBikeInfo } from '@/api/bikeInfo'
import { deleteMoreBikeInfo } from '@/api/bikeInfo'
import { findAllBikeType } from '@/api/bikeInfo'

export default {
  inject: ['reload'],
  data() {
    return {
      list: null,
      size: 0,
      listLoading: true,
      currentPage: 1,
      dialogVisible: false,
      dialogQRCodeVisible: false,
      checkList: [],
      disabled: [],
      form: {
        startNum: 0,
        endNum: 0
      },
      options: '',
      value: '',
      map: '',
      pmap: ''
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
      findAllBikeInfo().then(response => {
        this.size = response.data.length
        this.queryPage(1)
      })
    },
    queryPage(pageIndex) {
      findAllBikeType().then(response => {
        if (response.code === 1) {
          this.map = new Map()
          this.pmap = new Map()
          for (var i = 0; i < response.data.length; i++) {
            this.map.set(response.data[i].typeValue, response.data[i].typeName)
            this.pmap.set(response.data[i].typeValue, response.data[i].unitPrice)
          }
          queryPageBikeInfo(pageIndex, 5).then(response => {
            this.list = response.data
            for (var i = 0; i < response.data.length; i++) {
              this.list[i].index = (pageIndex - 1) * 5 + i
              this.list[i].sta = response.data[i].userId !== null && response.data[i].userId !== '' ? '使用中'
                : response.data[i].fix === '1' ? '维修中' : '未使用'
              this.disabled[i] = response.data[i].userId !== null && response.data[i].userId !== ''
              this.list[i].bikeTypeText = this.map.get(response.data[i].bikeType)
              this.list[i].unitPrice = this.pmap.get(response.data[i].bikeType)
            }
            this.listLoading = false
          })
        } else {
          this.$message.error(response.msg)
        }
      })
    },
    deleteBike() {
      if (this.checkList.length === 0) {
        Message({
          message: '请选择车辆',
          type: 'error',
          duration: 3 * 1000
        })
        return
      }
      this.dialogVisible = true
    },
    deleteMore() {
      deleteMoreBikeInfo(this.checkList).then(response => {
        if (response.code === 1) {
          Message({
            message: '删除成功',
            type: 'success',
            duration: 3 * 1000
          })
        } else {
          Message({
            message: '出现异常',
            type: 'error',
            duration: 3 * 1000
          })
        }
      })
      this.fetchData()
    },
    changePage() {
      this.queryPage(this.currentPage)
    },
    selectAll() {
      var ids = []
      for (var i = 0; i < this.list.length; i++) {
        if (this.list[i].userId !== '') {
          break
        }
        ids[i] = this.list[i].bikeId
      }
      if (this.checkList.length === ids.length) {
        this.checkList = []
      } else {
        this.checkList = ids
      }
    },
    showCreate() {
      findAllBikeType().then(response => {
        if (response.code === 1) {
          this.options = response.data
          this.dialogQRCodeVisible = true
        } else {
          this.$message.error(response.msg)
        }
      })
    },
    createQRCode() {
      if (this.value === '') {
        this.$message.error('请选择车辆类型')
      } else if (this.form.startNum === '') {
        this.$message.error('请输入开始编号')
      } else if (this.form.endNum === '') {
        this.$message.error('请输入结束编号')
      } else if (this.form.startNum.valueOf() >= this.form.endNum.valueOf()) {
        this.$message.error('结束编号应大于开始编号')
      } else if (this.form.startNum.valueOf() < 100000 || this.form.startNum.valueOf() >= 1000000) {
        this.$message.error('编号范围应在100000-999999之间')
      } else if (this.form.endNum.valueOf() < 100000 || this.form.endNum.valueOf() >= 1000000) {
        this.$message.error('编号范围应在100000-999999之间')
      } else {
        window.location.href = 'http://' + window.location.host + '/YKBikeServer/common/createQRCode?' +
          'startNum=' + this.form.startNum +
          '&endNum=' + this.form.endNum +
          '&bikeType=' + this.value
      }
    }
  }
}
</script>
