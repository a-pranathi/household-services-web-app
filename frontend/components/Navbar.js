export default {
    template : `
    <nav class="navbar navbar-expand-sm navbar-dark bg-dark">
        <div class="container-fluid">
            <a class="navbar-brand" href="/"> &ensp; HomeXpert&nbsp;</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mynavbar">
                <span class="navbar-toggler-icon"></span>
            </button>

            <div  class="collapse navbar-collapse" id="mynavbar">
                <ul class="navbar-nav me-auto">
                    <li class="nav-item"><router-link to="/" class = "nav-link">Home</router-link></li>
                    <li class="nav-item"><router-link v-if="!$store.state.loggedIn" to="/login" class = "nav-link">Login</router-link></li>
                    <li class="nav-item"><router-link v-if="$store.state.loggedIn && $store.state.role == 'admin'" to="/adminDashboard" class = "nav-link">Dashboard</router-link></li>
                    <li class="nav-item"><router-link v-if="$store.state.loggedIn && $store.state.role == 'professional'" to="/professionalDashboard" class = "nav-link">Dashboard</router-link></li>
                    <li class="nav-item"><router-link v-if="$store.state.loggedIn && $store.state.role == 'customer'" to="/customerDashboard" class = "nav-link">Dashboard</router-link></li>
                    <li class="nav-item"><router-link v-if="$store.state.loggedIn && $store.state.role == 'customer'" to="/services" class = "nav-link">Services</router-link></li>
                    <li class="nav-item"><router-link v-if="$store.state.loggedIn && $store.state.role == 'customer'" to="/payment" class = "nav-link">Payment</router-link></li>
                    <li class="nav-item"><router-link v-if="$store.state.loggedIn" to="/search" class = "nav-link">Search</router-link></li>
                    <li class="nav-item"><router-link v-if="$store.state.loggedIn" to="/summary" class = "nav-link">Summary</router-link></li>                    
                </ul>
                <form class="d-flex" v-if="$store.state.loggedIn">
                    <ul class="navbar-nav me-auto">
                        <li class="nav-item"><router-link to="/profile" class = "nav-link">{{this.$store.state.name}}</router-link></li>
                    </ul>
                    <button class="btn btn-primary" type="button" @click="submitLogout">Logout</button>
                </form>                    
            </div>
        </div>
    </nav>
    `
    ,
    methods : {
        async submitLogout(){
            this.$store.commit('logout')
            this.$router.push('/');
        }
    }
}