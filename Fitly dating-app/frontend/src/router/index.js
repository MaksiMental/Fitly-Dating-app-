import Vue from 'vue'
import Router from 'vue-router'
import Register from '@/components/Register'
import Login from '@/components/Login'
import Profile from '@/components/Profile'
import Update from '@/components/Update'
import Matches from '@/components/Matches'
import AdminPanel from '@/components/AdminPanel'
import UpdateAdmin from '@/components/UpdateAdmin'
import UsersAdmin from '@/components/UsersAdmin'
import MatchesAdmin from '@/components/MatchesAdmin'
import Recommended from '@/components/Recommended'

Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/',
            name: 'Register',
            component: Register
        },
        {
            path: '/login',
            name: 'Login',
            component: Login
        },
        {
            path: '/profile',
            name: 'Profile',
            component: Profile
        },
        {
            path: '/update',
            name: 'Update',
            component: Update
        },
        {
            path: '/matches',
            name: 'Matches',
            component: Matches
        },
        {
            path: '/adminpanel',
            name: 'AdminPanel',
            component: AdminPanel
        },
        {
            path: '/updateadmin',
            name: 'UpdateAdmin',
            component: UpdateAdmin
        },
        {
            path: '/usersadmin',
            name: 'UsersAdmin',
            component: UsersAdmin
        },
        {
            path: '/matchesadmin',
            name: 'MatchesAdmin',
            component: MatchesAdmin
        },
        {
            path: '/recommended',
            name: 'Recommended',
            component: Recommended
        },
    ]
})