import store from "./store.js"
import HomePage from "../pages/HomePage.js";
import LoginPage from "../pages/LoginPage.js";
import RegisterPage from "../pages/RegisterPage.js";
import AdminDashBoardPage from "../pages/AdminDashBoardPage.js";
import ProfessionalDashboardPage from "../pages/ProfessionalDashboardPage.js"
import CustomerDashboardPage from "../pages/CustomerDashboardPage.js"
import SearchPage from "../pages/SearchPage.js"
import SummaryPage from "../pages/SummaryPage.js"
import ProfilePage from "../pages/ProfilePage.js"
import DisplayReviewPage from "../pages/DisplayReviewPage.js";

import Services from "../components/Services.js";
import UserList from "../components/UserList.js";
import BookingList from "../components/BookingList.js";
import Downloads from "../components/Downloads.js";
import Configuration from "../components/Configuration.js";
import PaymentPage from "../pages/PaymentPage.js";

const routes = [
    {path : "/", component : HomePage},
    {path : "/login", component : LoginPage},
    {path : "/register/:registerFor", props : true, component : RegisterPage},
    {path : "/adminDashboard", component : AdminDashBoardPage, meta : {requiresLogin : true, role : "admin"}},
    {path : "/professionalDashboard", component : ProfessionalDashboardPage, meta : {requiresLogin : true, role : "professional"}},
    {path : "/customerDashboard", component : CustomerDashboardPage, meta : {requiresLogin : true, role : "customer"}},
    {path : "/search", component : SearchPage, meta : {requiresLogin : true}},
    {path : "/summary", component : SummaryPage, meta : {requiresLogin : true}}, 
    {path : "/profile", component : ProfilePage, meta : {requiresLogin : true}},    
    {path : '/reviews/:id', component : DisplayReviewPage, props : true, meta : {requiresLogin : true}},

    {path : "/users", component : UserList, meta : {requiresLogin : true}},
    {path : "/services", component : Services, meta : {requiresLogin : true}},
    {path : "/bookings", component : BookingList, meta : {requiresLogin : true}},
    {path : "/downloads", component : Downloads, meta : {requiresLogin : true}},
    {path : "/configuration", component :Configuration, meta : {requiresLogin : true}},
    {path : "/payment", component : PaymentPage, meta : {requiresLogin : true, role : "customer"}},    
]

const router = new VueRouter({routes})

router.beforeEach((to, from, next) => {
    if (to.matched.some((record) => record.meta.requiresLogin)){
        if (!store.state.loggedIn){
            next({path : "/login"})
        } else if (to.meta.role && to.meta.role != store.state.role){
             next({path : "/"})
        } else {
            next();
        }
    } else {
        next();
    }
})
export default router;