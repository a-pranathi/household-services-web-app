
export default {
    template : `
        <div>
            <div class="card mt-2 p-2">
                <h3 class="text-primary text-center" > Welcome to the Search dashboard!</h3>
            </div>        
            <div class="card mt-2 p-3">
                <div class="input-group ">
                    <select class="form-select" id="SearchTypeId" v-model="searchType" required>
                        <option v-if="$store.state.loggedIn && $store.state.role == 'admin'" value="users">Users</option>
                        <option value="servicecategories">Service Category</option>
                        <option value="services">Service</option>                
                    </select>
                    <input type="text" class="form-control" placeholder="Search" v-model="search_query" style="width: 300px;" @keypress.enter="fetchData">
                    <button class="btn btn-success" @click="fetchData" style="width: 75px;">Search</button>
                </div>
                <hr/>
                <div id="background-canvas">
                    <div id="canvas">
                        <h3 v-if="searchType == 'users'">Users</h3>
                        <h3 v-if="searchType == 'servicecategories'">Service Categories</h3>
                        <h3 v-if="searchType == 'services'">Services</h3>                                
                        <hr/>
                        <div class="table-responsive small">
                            <table class="table table-striped table-sm" id="all-items">
                                <thead style="font-size: 14px;">
                                    <tr v-if="searchType == 'users'">
                                        <th class="bg-primary text-white text-center" valign="middle">Name</th>
                                        <th class="bg-primary text-white text-center" valign="middle">Email</th>
                                        <th class="bg-primary text-white text-center" valign="middle">Phone Number</th>
                                        <th class="bg-primary text-white text-center" valign="middle">Address</th>
                                        <th class="bg-primary text-white text-center" valign="middle">Area code</th>
                                        <th class="bg-primary text-white text-center" valign="middle">Status</th>
                                    </tr>
                                    <tr v-if="searchType == 'servicecategories'">
                                        <th class="bg-primary text-white text-center" valign="middle">Name</th>
                                        <th class="bg-primary text-white text-center" valign="middle">Description</th>
                                    </tr>
                                    <tr v-if="searchType == 'services'">
                                        <th class="bg-primary text-white text-center" valign="middle">Name</th>
                                        <th class="bg-primary text-white text-center" valign="middle">Description</th>
                                        <th class="bg-primary text-white text-center" valign="middle">Base Price</th>
                                        <th class="bg-primary text-white text-center" valign="middle">Time Required</th>
                                        <th class="bg-primary text-white text-center" valign="middle">Service Category</th>                                                                
                                    </tr>                                                        
                                </thead>
                                <tbody v-if="searchType == 'users'">
                                    <tr v-for="user in users" :key="user.id">
                                        <td>{{user.name}}</td>
                                        <td>{{user.email}}</td>
                                        <td>{{user.phone_number}}</td>
                                        <td>{{user.address}}</td>
                                        <td>{{user.area_code}}</td>
                                        <td>{{user.active}}</td>
                                    </tr>                            
                                </tbody>
                                <tbody v-if="searchType == 'servicecategories'">
                                    <tr v-for="servicecategory in servicecategories" :key="servicecategory.id">
                                        <td>{{servicecategory.name}}</td>
                                        <td>{{servicecategory.description}}</td>
                                    </tr>
                                </tbody>
                                <tbody v-if="searchType == 'services'">
                                    <tr v-for="service in services" :key="service.id">
                                        <td>{{service.name}}</td>
                                        <td>{{service.description}}</td>
                                        <td align="right">{{service.base_price}}</td>
                                        <td align="right">{{service.time_required}}</td>
                                        <td>{{service.servicecategory.name}}</td>
                                    </tr>                        
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
    data() {
        return{
            search_query : null,
            searchType : null,
            users : [],
            services : [],
            servicecategories : [],
        }        
    },
    methods : {
        async fetchData(){
            if (this.searchType === "users"){
                let url = location.origin + "/api/users/search/" + this.search_query;

                const res = await fetch(url,{
                    headers : {
                        "Authentication-Token" : this.$store.state.auth_token
                    }
                })

                if (res.ok){
                    this.users = await res.json()
                }
            }
            if (this.searchType === "servicecategories"){
                let url = location.origin + "/api/servicecategories/search/" + this.search_query;

                const res = await fetch(url,{
                    headers : {
                        "Authentication-Token" : this.$store.state.auth_token
                    }
                })

                if (res.ok){
                    this.servicecategories = await res.json()
                }
            }
            if (this.searchType === "services"){
                let url = location.origin + "/api/services/search/" + this.search_query;

                const res = await fetch(url,{
                    headers : {
                        "Authentication-Token" : this.$store.state.auth_token
                    }
                })

                if (res.ok){
                    this.services = await res.json()
                }    
            }            
        },
    },
  
    async mounted(){    
        this.searchType = "services"
    }
 }