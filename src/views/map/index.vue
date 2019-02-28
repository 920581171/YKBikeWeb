<template>
  <div>
    <div id="container" style="position:fixed;width:100%; height:100%"></div>
  </div>
</template>
<script>
  import AMap from 'AMap'
  import { findAllBikeInfo } from '@/api/bikeInfo'
  import { findAllSiteLocation } from '@/api/siteLocation'
  import { Message } from 'element-ui'

  var marker, map
  export default {
    mounted: function() {
      this.init()
    },
    methods: {
      init: function() {
        map = new AMap.Map('container', {
          resizeEnable: true,
          zoom: 15
        })
        // 添加控制按钮
        AMap.plugin(['AMap.ToolBar', 'AMap.Scale'], function() {
          map.addControl(new AMap.ToolBar())
          map.addControl(new AMap.Scale())
        })
        map.on('complete', function() {
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
        })
        function addBike(data) {
          var icon = data.fix === '0' ? './static/svg/location_on.svg' : './static/svg/location_off.svg'
          marker = new AMap.Marker({
            icon: icon,
            position: [data.longitude, data.latitude]
          })
          marker.setMap(map)
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
          circleMarker.setMap(map)
        }
      }
    }
  }
</script>
<style>
</style>
