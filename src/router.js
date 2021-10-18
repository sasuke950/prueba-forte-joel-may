import Home from './components/Home.vue';
import Clients from './components/Clients/Table.vue';
import { AuthService } from "./utils/authService";

export const routes = [{
    path: '*',
    redirect: '/'
}, {
    path: '',
    name: 'home',
    component: Home,
    meta: {
        auth: false
    }
}, {
    path: '/clients/table',
    name: 'clients',
    component: Clients,
    meta: {
        auth: true
    },
    beforeEnter: (to, from, next) => {
        (AuthService.validateSession()) ?
            next() : next('/')
    },
    beforeDestroy() {
        AuthService.destroySession();
    },
}]