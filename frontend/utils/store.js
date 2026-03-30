const store = new Vuex.Store({
    state : {
        auth_token : null,
        id : null,
        name : null,
        email : null,
        phone_number : null,
        area_code : null,
        address : null,
        role : null,
        loggedIn : false,
    },
    
    mutations : {
        setUser(state){
            try {
                if (JSON.parse(localStorage.getItem("user"))) {
                    const user = JSON.parse(localStorage.getItem("user"));
                    state.auth_token = user.auth_token;
                    state.id = user.id;
                    state.name = user.name;
                    state.email = user.email;
                    state.phone_number = user.phone_number;
                    state.area_code = user.area_code;
                    state.address = user.address;
                    state.role = user.role;
                    state.loggedIn = true;
                }
            }
            catch {
                console.warn("User not logged in!")
            }
        },
        
        logout(state) {
            state.auth_token = null;
            state.id = null;
            state.name = null;
            state.email = null;
            state.phone_number = null;
            state.area_code = null;
            state.address = null;
            state.role = null;
            state.loggedIn = false;

            localStorage.removeItem("user");
        }
    },

    actions : {

    }
})

store.commit("setUser");

export default store;