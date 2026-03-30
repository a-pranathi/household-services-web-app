import GenericDialogue from "../components/GenericDialogue.js";

export default {
    props : ["registerFor"],
    template : `
        <div class="container mt-3">
            <div v-bind:class="classStyle">
                <h1>HomeXpert registration page</h1>      
                <div class="row">
                    <div class="col-md-5 p-3">
                        <p>Register for world's best and unmatching house hold services. This great platfom includes many benifits to customers and service professionals.</p>
                        <p>There are many benefits. Following are few features...</p>

                        <ul>
                            <li>Fast and Responsive user interface</li>
                            <li>Works on computer, tables and phones</li>
                            <li>Interactive dashboards</li>
                            <li>User and role based security </li>
                            <li>Daily reminders, weekly updates and monthly reports</li>
                        </ul>

                    </div>
                    <div class="col-md-5 p-3">
                        <div class="card" style="width: 40rem;">
                            <div class="card-body">
                                <h4>Registration Details for {{registerFor}}</h4>
                                <div class="form-floating mt-2">
                                    <input type="text" class="form-control" id="nameField" v-model="name" required>
                                    <label for="nameField">Name</label>
                                </div>
                                <div class="form-floating mt-2">
                                    <input type="email" class="form-control" id="emailField" v-model="email" required>
                                    <label for="emailField">Email</label>
                                </div>        
                                <div class="form-floating mt-2">
                                    <input type="password" class="form-control" id="passwordField" v-model="password" required>
                                    <label for="passwordField">Password</label>
                                </div>
                                <div class="form-floating mt-2">
                                    <input type="number" step="1" class="form-control" id="phoneNumbereField" v-model="phone_number" required>
                                    <label for="phoneNumbereField">Phone number</label>
                                </div>
                                <div class="form-floating mt-2">
                                    <input type="number" step="1" class="form-control" id="areaCodeField" v-model="area_code" required>
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
                                    <input type = "number" step = "1" class="form-control" id="experiencefield" v-model="experience" required>
                                    <label for="experiencefield">Years of Experience</label>
                                </div>
                                <div>
                                    <button class="btn btn-primary mt-4" @click="submitRegister">Register</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <generic-dialogue ref="genericDialogue"></generic-dialogue>
        </div>
    `,
    data(){
        return {
            name : null,
            email : null,
            password : null,
            phone_number : null,
            area_code : null,
            address : null,
            servicecategory_id : -1,
            experience : 0,
            serviceCategories : [],
            classStyle : "mt-4 p-4 bg-primary text-white rounded",
        }
    },

    components: { GenericDialogue},

    methods : {
        async submitRegister(){
            const res = await fetch(location.origin+"/api/register",
                { 
                    method : "POST",
                    headers : {"Content-type" : "application/json"},
                    body : JSON.stringify({
                        "name" : this.name,
                        "email" : this.email,
                        "password" : this.password,
                        "phone_number" : this.phone_number,
                        "area_code": this.area_code,
                        "address" : this.address,
                        "servicecategory_id" : this.servicecategory_id,
                        "experience" : this.experience,
                        "role": this.registerFor
                    })
                }
            )
            if (res.ok){
                const data = await res.json()
                

                const ok = await this.$refs.genericDialogue.show({
                    title : 'Register User',
                    message : 'Registration of user ' + this.name + "is successful!",
                    confirmButtonStyle : "btn btn-success",
                    confirmButtonText : "OK",
                    confirmButtonDisplay : true,
                    cancelButtonStyle : "",
                    cancelButtonText: "",                    
                    cancelButtonDisplay : false,
                })  

                this.$router.push('/login')
            }
            else {
                const data = await res.json()

                const ok = await this.$refs.genericDialogue.show({
                    title : 'Register User - Failed',
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
    async mounted(){    
        
        if (this.registerFor === "professional") {
                this.classStyle = "mt-4 p-4 bg-secondary text-white rounded";
        } 
        else {
            this.classStyle = "mt-4 p-4 bg-primary text-white rounded";
        }
        const res = await fetch(`${location.origin}/api/servicecategories`, {
            headers : {
            }
        });
        if (res.ok){
            this.serviceCategories = await res.json();
        };
     }
}