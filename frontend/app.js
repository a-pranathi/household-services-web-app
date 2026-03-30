import Navbar from "./components/Navbar.js"
import router from "./utils/router.js"
import store from "./utils/store.js"

const app = new Vue({
    el : "#app",
    template : `
        <div class="vw-100 vh-100">
            <Navbar></Navbar>
            <div class="container p-2">
                <router-view></router-view>
            </div>
        </div>
    `,
    components : {
        Navbar,
    },
    router,
    store,
})