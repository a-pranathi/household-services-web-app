import GenericDialogue from "../components/GenericDialogue.js";

export default {
    props : ["registerFor"],
    template : `
    <div class="card mt-5 p-3" style="width: 40rem;">
        <div class="card-body">
            <h4>My Profile</h4>
            <div class="form-floating mt-2">
                <input type="text" class="form-control" id="nameField" v-model="user.name" required disabled>
                <label for="nameField">Name</label>
            </div>
            <div class="form-floating mt-2">
                <input type="email" class="form-control" id="emailField" v-model="user.email" required disabled>
                <label for="emailField">Email</label>
            </div>
            <div class="form-floating mt-2">
                <input type="password" class="form-control" id="passwordField" v-model="password" required>
                <label for="passwordField">Password</label>
            </div>
            <div class="form-floating mt-2">
                <input type="number" step = "1" class="form-control" id="phoneNumbereField" v-model="phone_number" required>
                <label for="phoneNumbereField">Phone number</label>
            </div>
            <div class="form-floating mt-2">
                <input type="number" step = "1" class="form-control" id="areaCodeField" v-model="area_code" required>
                <label for="areaCodeField">Area code</label>
            </div>
            <div class="form-floating mt-2">
                <input type="text" class="form-control" id="addressField" v-model="address" required>
                <label for="addressField">Address</label>
            </div>
            <div class="form-floating mt-2" v-if="registerFor == 'professional'">
                <select class="form-select" id="serviceCategoryIdField" v-model="servicecategory_id" required>
                    <option v-for="servicecategory in serviceCategories" :value="servicecategory.id">{{servicecategory.name}}</option>
                </select>
                <label for="serviceCategoryIdField">Service Category</label>
            </div>
            <div class="form-floating mt-2" v-if="registerFor == 'professional'">
                <input type="text" class="form-control" id="experiencefield" v-model="experience" required>
                <label for="experiencefield">Years of Experience</label>
            </div>
            <div>
            <button class="btn btn-primary mt-4" @click="submitUpdate">Update</button>
            </div>
        </div>
        <generic-dialogue ref="genericDialogue"></generic-dialogue>
    </div>
    `, 
    data(){
        return {
            password : null,
            phone_number : null,
            area_code : null,
            address : null,
            user : {}
        }
    },

    components: { 
        GenericDialogue
    },

    methods : {
        async submitUpdate(){

            const ok = await this.$refs.genericDialogue.show({
                title : 'Profile Update',
                message : "Do you want to submit the profile changes?",
                confirmButtonStyle : "btn btn-primary",
                confirmButtonText: "OK",
                confirmButtonDisplay : true,
                cancelButtonStyle : "btn btn-secondary",
                cancelButtonText: "Go Back",
                cancelButtonDisplay : true,
            });

            if (ok) {

            const body = JSON.stringify({
                "password" : this.password,
                "phone_number" : this.phone_number,
                "area_code": this.area_code,
                "address" : this.address,
            })
            
            const res = await fetch(location.origin+"/api/users/"+this.$store.state.id+"?action=update",
                { 
                    method : "PUT",
                    headers : {"Content-type" : "application/json"},
                    body : JSON.stringify({
                        "password" : this.password,
                        "phone_number" : this.phone_number,
                        "area_code": this.area_code,
                        "address" : this.address,
                    })
                }
            )
            if (res.ok){
            }
            else {
                const data = await res.json()

                const ok = await this.$refs.genericDialogue.show({
                    title : 'Profile Update - Failed',
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
        }
    },
    async mounted(){

        const res = await fetch(`${location.origin}/api/users/${this.$store.state.id}`, {
            headers : {
                "Content-type" : "application/json",
                'Authentication-Token' : this.$store.state.auth_token
            }
        });
        if (res.ok){
            this.user = await res.json();
            this.phone_number = this.user.phone_number;
            this.area_code = this.user.area_code;
            this.address = this.user.address;
        };
     }
}