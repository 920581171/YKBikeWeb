import Vue from 'vue'
import Router from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
**/
export const constantRouterMap = [
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/404', component: () => import('@/views/404'), hidden: true },
  { path: '/deposit', name: 'Deposit', component: () => import('@/views/table/deposit'), hidden: true },
  { path: '/balance', name: 'Balance', component: () => import('@/views/table/balance'), hidden: true },

  {
    path: '/',
    component: Layout,
    redirect: '/home',
    name: 'Home',
    hidden: true,
    children: [{
      path: 'home',
      component: () => import('@/views/dashboard/index')
    }]
  },

  {
    path: '',
    component: Layout,
    children: [
      {
        path: 'home',
        name: 'Home',
        component: () => import('@/views/dashboard/index'),
        meta: { title: '首页', icon: 'home' }
      }
    ]
  },

  {
    path: '/map',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Form',
        component: () => import('@/views/map/index'),
        meta: { title: '地图', icon: 'map' }
      }
    ]
  },

  {
    path: '/info',
    component: Layout,
    redirect: '/info/table',
    name: 'Info',
    meta: { title: '信息管理', icon: 'table' },
    children: [
      {
        path: 'userinfo',
        name: 'userInfo',
        component: () => import('@/views/table/userinfo'),
        meta: { title: '用户管理', icon: 'user' }
      },
      {
        path: 'admininfo',
        name: 'adminInfo',
        component: () => import('@/views/table/admininfo'),
        meta: { title: '管理员信息', icon: 'admin' }
      },
      {
        path: 'adminaregister',
        name: 'Form',
        component: () => import('@/views/form/index'),
        meta: { title: '添加管理员', icon: 'admin_add' }
      }
    ]
  },

  {
    path: '/list',
    component: Layout,
    redirect: '/info/list',
    name: 'List',
    meta: { title: '统计报表', icon: 'list' },
    children: [
      {
        path: 'bikerecord',
        name: 'bikerecord',
        component: () => import('@/views/table/bikerecord'),
        meta: { title: '骑行记录', icon: 'bike' }
      }
    ]
  },

  {
    path: '/broad',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Form',
        component: () => import('@/views/table/broad'),
        meta: { title: '留言板', icon: 'broad' }
      }
    ]
  },

  {
    path: '/about',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Form',
        component: () => import('@/views/about/index'),
        meta: { title: '关于', icon: 'info' }
      }
    ]
  },

  { path: '*', redirect: '/404', hidden: true }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

