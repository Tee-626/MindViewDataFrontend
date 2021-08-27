import Vue from 'vue'
import Router from 'vue-router'

import UserList from "@/view/UserList";
import TestList from "@/view/TestList";

Vue.use(Router);

export default new Router({
    // mode: "history",
    routes: [
        {
            path: '/userList',
            component: UserList
        },
        {
            path: '/testList',
            component: TestList
        }
    ]
});