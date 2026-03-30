import GenericDialogue from "./GenericDialogue.js";

export default {
  template : `
    <div class="container mt-2">
        <div class="card mt-2 p-2">
            <h3 class="text-primary text-center" > Welcome to the Users Page!</h3>
        </div>
        <div id="background-canvas">
            <div class="card mt-2 p-3">
                <h3 class="card-header d-flex justify-content-between align-items-center">Users</h3>
                <hr/>
                <div class="table-responsive small">
                    <table class="table table-striped table-sm" id="all-services">
                        <thead style="font-size: 14px;">
                            <tr>
                                <th class="bg-primary text-white text-center" valign="middle">Name</th>
                                <th class="bg-primary text-white text-center" valign="middle">Role</th>                                
                                <th class="bg-primary text-white text-center" valign="middle">Email</th>
                                <th class="bg-primary text-white text-center" valign="middle">Phone Number</th>
                                <th class="bg-primary text-white text-center" valign="middle">Area code</th>
                                <th class="bg-primary text-white text-center" valign="middle">Rating</th>
                                <th class="bg-primary text-white text-center" valign="middle">Service Category</th>
                                <th class="bg-primary text-white text-center" valign="middle">Experience</th>
                                <th class="bg-primary text-white text-center" valign="middle">Approval Status</th>                                
                                <th class="bg-primary text-white text-center" valign="middle">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="user in users" :key="user.id">
                                <td>{{user.name}}</td>
                                <td>{{user.roles[0].name}}</td>                                
                                <td>{{user.email}}</td>
                                <td>{{user.phone_number}}</td>
                                <td>{{user.area_code}}</td>
                                <td >{{user.rating}}</td>
                                <td>{{user.servicecategory.name}}</td>
                                <td v-if="user.roles[0].name == 'professional'">{{user.experience}}</td>
                                <td v-else></td>
                                <td>{{user.approval_status}}</td>
                                <td>
                                    <button v-if="$store.state.loggedIn && $store.state.role == 'admin' && !user.approval_status" class="btn btn-outline-success" title="Approve User" @click="updateStatus(user.id, 'approve')"><i class="bi bi-check2-circle"></i></button>                                    
                                    <button v-if="$store.state.loggedIn && $store.state.role == 'admin' && user.approval_status" class="btn btn-outline-danger" title="Reject User" @click="updateStatus(user.id, 'reject')"><i class="bi bi-x-square"></i></button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        <generic-dialogue ref="genericDialogue"></generic-dialogue>
    </div>
`, 

  data(){
    return{
        users : [],
    };
  },

  components: { GenericDialogue },
  
  methods: {
    
    async fetchData(){
        let url = location.origin + "/api/users";
        const res = await fetch(url,{
            headers : {
                "Authentication-Token" : this.$store.state.auth_token
            }
        })

        this.users = await res.json()
    },

    async updateStatus(user_id, action) {

        let title = 'Approve User';
        let message = 'Are you sure you want to approve this User?';
        let confirmButtonText = 'Approve';
        let confirmButtonStyle = "btn btn-success";

        if (action === "reject") {
            title = 'Reject User';
            message = 'Are you sure you want to reject this User?';
            confirmButtonText = 'Reject';
            confirmButtonStyle = "btn btn-danger";
        }

        const ok = await this.$refs.genericDialogue.show({
            title : title,
            message : message,
            confirmButtonStyle : confirmButtonStyle,
            confirmButtonText : confirmButtonText,
            confirmButtonDisplay : true,
            cancelButtonStyle : "btn btn-secondary",
            cancelButtonText: "Go Back",                    
            cancelButtonDisplay : true,
        })  


        if (ok) {
            let url = location.origin + "/api/users/" + user_id.toString()+"?action="+action
            const res = await fetch(url, {
                method : "PUT",
                headers : {
                    "Authentication-Token" : this.$store.state.auth_token
                }
            });

            if (res.ok) {
                this.fetchData();
            }
            else {
                const data = await res.json()

                const ok = await this.$refs.genericDialogue`.show`({
                    title : 'Approve User - Failed',
                    message : data.error_code + ": " + data.error_message,
                    confirmButtonStyle : "btn btn-danger",
                    confirmButtonText : "OK",
                    confirmButtonDisplay : true,
                    cancelButtonStyle : "",
                    cancelButtonText: "",                    
                    cancelButtonDisplay : false,
                })  
            }
        }
    },
  },

  async mounted(){
    this.fetchData();
  },
}