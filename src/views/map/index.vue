<template>
  <div>
    <div id="container" style="position:fixed;width:100%; height:100%"></div>
    <el-dropdown @command="handleCommand" style="width:128px;margin-top:16px;margin-left:100px;z-index: 2">
      <el-button type="primary">
        操作<i class="el-icon-arrow-down el-icon--right"></i>
      </el-button>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="isOpen">{{isOpenText}}</el-dropdown-item>
        <el-dropdown-item command="bikeInfo">显示车辆位置</el-dropdown-item>
        <el-dropdown-item command="siteLocation">显示站点位置</el-dropdown-item>
        <el-dropdown-item command="close">关闭显示</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>

    <el-dialog id="bbq"
      title="更新位置"
      :visible.sync="dialogVisible"
      width="30%">
      <spen>更新车辆ID：{{bikeId}}的位置？</spen>
      <span slot="footer" class="dialog-footer">
    <el-button @click="[dialogVisible = false,cancel(bikeId)]">取 消</el-button>
    <el-button type="primary" @click="[dialogVisible = false,updateBike(bikeId)]">更 新</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import AMap from 'AMap'
  import { findAllBikeInfo } from '@/api/bikeInfo'
  import { findAllSiteLocation } from '@/api/siteLocation'
  import { setWebSocketOnMessage } from '@/websocket'
  import { updateBikeLocation } from '@/api/bikeInfo'
  import { Message } from 'element-ui'
  import { mapGetters } from 'vuex'

  var amap

  var mapMonitor = new Map()

  var mapBike = new Map()

  var mapLocation = new Map()

  var isOpen = false

  var thisDomain

  var beforeData

  export default {
    mounted: function() {
      thisDomain = this
      this.init()
    },
    data() {
      return {
        isOpenText: '开启实时监控',
        dialogVisible: false
      }
    },
    computed: {
      ...mapGetters([
        'adminType'
      ])
    },
    methods: {
      show: function() {
        Message({
          message: '更新成功',
          type: 'success',
          duration: 5 * 1000
        })
      },
      init: function() {
        amap = new AMap.Map('container', {
          resizeEnable: true,
          zoom: 15
        })
        // 添加控制按钮
        AMap.plugin(['AMap.ToolBar', 'AMap.Scale'], function() {
          amap.addControl(new AMap.ToolBar())
          amap.addControl(new AMap.Scale())
        })
        amap.on('complete', function() {
          findAllBikeInfo().then(response => {
            if (response.code === 1) {
              const datas = response.data
              for (var i = 0; i < datas.length; i++) {
                addBike(datas[i])
              }
            } else {
              Message({
                message: response.msg,
                type: 'error',
                duration: 3 * 1000
              })
            }
          })
          findAllSiteLocation().then(response => {
            if (response.code === 1) {
              const datas = response.data
              for (var i = 0; i < datas.length; i++) {
                addSiteLocation(datas[i])
              }
            } else {
              Message({
                message: response.msg,
                type: 'error',
                duration: 3 * 1000
              })
            }
          })
          Message({
            message: '地图加载完成',
            type: 'success',
            duration: 3 * 1000
          })
          setWebSocketOnMessage(websocketOnMessage)
        })
      },
      handleCommand(command) {
        if (command === 'isOpen') {
          if (this.adminType === '1') {
            this.$message({
              message: '权限不够',
              type: 'error',
              duration: 3 * 1000
            })
            return
          }
          if (isOpen === true) {
            this.isOpenText = '开启实时监控'
            isOpen = false
            Message({
              message: '关闭实时监控',
              duration: 3 * 1000
            })
          } else {
            this.isOpenText = '关闭实时监控'
            isOpen = true
            Message({
              message: '开启实时监控',
              type: 'success',
              duration: 3 * 1000
            })
          }
        } else if (command === 'bikeInfo') {
          mapBike.forEach(function(value, key, map) {
            value.setMap(amap)
          })
        } else if (command === 'siteLocation') {
          mapLocation.forEach(function(value, key, map) {
            value.setMap(amap)
          })
        } else if (command === 'close') {
          mapBike.forEach(function(value, key, map) {
            value.setMap(null)
          })
          mapLocation.forEach(function(value, key, map) {
            value.setMap(null)
          })
        }
      },
      cancel(bikeId) {
        var bikeLocation = mapBike.get(bikeId)
        bikeLocation.setMap(null)
        addBike(beforeData)
      },
      updateBike(bikeId) {
        var bikeLocation = mapBike.get(bikeId)
        updateBikeLocation(bikeId, bikeLocation.getPosition().getLat(), bikeLocation.getPosition().getLng()).then(response => {
          if (response.code === 1) {
            Message({
              message: '更新成功',
              type: 'success',
              duration: 3 * 1000
            })
          } else {
            Message({
              message: response.msg,
              type: 'error',
              duration: 3 * 1000
            })
          }
        })
      }
    }
  }

  function addUserLocation(data) {
    var userlocation = mapMonitor.get(data.userId)
    if (userlocation == null) {
      userlocation = new AMap.Marker({
        icon: './static/svg/bike.svg',
        position: [data.longitude, data.latitude]
      })
      userlocation.setMap(amap)
      mapMonitor.set(data.userId, userlocation)
    } else {
      userlocation.setMap(null)
      userlocation = new AMap.Marker({
        icon: './static/svg/bike.svg',
        position: [data.longitude, data.latitude]
      })
      userlocation.setMap(amap)
      mapMonitor.set(data.userId, userlocation)
    }
  }
  function addBike(data) {
    var icon = data.fix === '0' ? './static/svg/location_on.svg' : './static/svg/location_off.svg'
    var marker = new AMap.Marker({
      icon: icon,
      position: [data.longitude, data.latitude],
      draggable: true,
      cursor: 'move',
      // 设置拖拽效果
      raiseOnDrag: true
    })
    marker.on('dragstart', function() {
      beforeData = data
    })
    marker.on('dragend', function() {
      thisDomain.bikeId = data.bikeId
      thisDomain.dialogVisible = true
    })
    marker.setMap(amap)
    mapBike.set(data.bikeId, marker)
  }
  function addSiteLocation(data) {
    var center = [data.longitude, data.latitude]
    var circleMarker = new AMap.CircleMarker({
      center: center,
      radius: data.radius,
      strokeColor: 'white',
      strokeWeight: 2,
      strokeOpacity: 0.5,
      fillColor: 'rgba(216,27,96,1)',
      fillOpacity: 0.5,
      zIndex: 10,
      bubble: true,
      cursor: 'pointer',
      clickable: true
    })
    circleMarker.setMap(amap)
    mapLocation.set(data.siteId, circleMarker)
  }
  function websocketOnMessage(event) {
    if (isOpen === false) {
      return
    }
    var onMessage = JSON.parse(event.data)
    var data = JSON.parse(onMessage.data)
    if (onMessage.type === 3) {
      var userlocation = mapMonitor.get(data.userId)
      if (userlocation != null) {
        userlocation.setMap(null)
      }
      return
    }
    if (onMessage.type !== 2) {
      return
    }
    addUserLocation(data)
  }
</script>
<style>
</style>
