import GenericDialogue from "../components/GenericDialogue.js"

export default {
    template : `

    <div>
        <div class="background-image"></div>
        <div class="container-fluid h-100">
            <div class="row h-100">
                <div class="col-6"></div>
                    <div class="col-6 d-flex justify-content-center align-items-center">
                        <div class="overlay mt-5 p-4">
                            <div class="card p-3 shadow-lg rounded">
                                <h2 class="text-center text-primary">HomeXpert</h2>
                                <form @submit.prevent="submitLogin">
                                    <div class="mb-3">
                                        <label for="formGroupExampleInput" class="form-label">Email</label>
                                        <input type="email" class="form-control" v-model="email" @keypress.enter="submitLogin" placeholder="Enter email address" required>
                                    </div>
                                    <div class="mb-3">
                                        <label for="formGroupExampleInput2" class="form-label">Password</label>
                                        <input type="password" class="form-control" v-model="password" @keypress.enter="submitLogin" placeholder="Enter password" required>
                                    </div>
                                    <button type="submit" class="btn btn-primary mt-3">Login</button>
                                </form>
                                <div class="text-center p-3">
                                    <p class="h6">
                                        <router-link v-if="!$store.state.loggedIn" to="/register/customer">No Account? Register!</router-link>
                                        <hr/>
                                        <router-link v-if="!$store.state.loggedIn" to="/register/professional">Register as Professional!</router-link>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <generic-dialogue ref="genericDialogue"></generic-dialogue>
        </div>
    </div>
    `
    ,
    data(){
        return {
            email : null,
            password : null,
        }
    },

    components: {GenericDialogue},
    computed: {
        emailValid() {
          const re = /\S+@\S+\.\S+/;
          return re.test(this.email);
        }
      },

    methods : {
        async submitLogin(){
            if (!this.emailValid) {
                const ok = await this.$refs.genericDialogue.show({
                    title : 'Login User - Failed',
                    message : "Please enter a valid email address",
                    confirmButtonStyle : "btn btn-danger",
                    confirmButtonText: "OK",
                    confirmButtonDisplay : true,
                    cancelButtonStyle : "",
                    cancelButtonText: "",
                    cancelButtonDisplay : false,
                });
            }
            else {
                const res = await fetch(location.origin+"/api/login",
                    { 
                        method : "POST",
                        headers : {"Content-type" : "application/json"},
                        body : JSON.stringify({"email" : this.email, "password": this.password})
                    }
                )
                if (res.ok){
                    const data = await res.json()

                    localStorage.setItem("user", JSON.stringify(data))
                    this.$store.commit("setUser")

                    if (this.$store.state.role == 'admin'){
                        this.$router.push('/adminDashboard')
                    }
                    else if (this.$store.state.role == 'professional'){
                        this.$router.push('/professionalDashboard')
                    }
                    else
                        this.$router.push('/customerDashboard')
                }
                else {
                    const data = await res.json()

                    const ok = await this.$refs.genericDialogue.show({
                        title : 'Login User - Failed',
                        message : data.error_code + ": " + data.error_message,
                        confirmButtonStyle : "btn btn-danger",
                        confirmButtonText: "OK",
                        confirmButtonDisplay : true,
                        cancelButtonStyle : "",
                        cancelButtonText: "",
                        cancelButtonDisplay : false,
                    });
                                    
                    this.$router.push('/login')
                }
            }
        }
    }
}