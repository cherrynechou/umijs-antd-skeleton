export default [
  {
    path: '/admin',
    layout: false,
    routes:[
      {
        name: 'login',
        path: '/admin/login',
        component: './Admin/Login'
      },{
        component: './Exception/404'
      }
    ]
  }, {
    path: '/auth',
    name: 'auth',
    routes: [
      {
        path: '/auth/users',
        name: 'user',
        component: './Auth/User'
      },{
        path: '/auth/menus',
        name: 'menu',
        component: './Auth/Menu'
      },{
        path: '/auth/permissions',
        name: 'permission',
        component: './Auth/Permission'
      },{
        path: '/auth/roles',
        name: 'role',
        component: './Auth/Role'
      }
    ]
  }, {
    path: '/',
    redirect: '/dashboard',
  }, {
    path: '/dashboard',
    name: 'dashboard',
    component: './Dashboard'
  },{
    path: '/error/403',
    component: './Exception/403'
  },{
    component: './Exception/404'
  }
]