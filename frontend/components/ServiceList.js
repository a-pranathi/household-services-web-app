import GenericDialogue from "./GenericDialogue.js";
import ComponentModal from "./ComponentModal.js";
import ServiceDetails from "./ServiceDetails.js";
import BookingDetails from "./BookingDetails.js";

export default {
    props : ["serviceCategoryId"],
  template : `
    <div class="container">
        <div id="background-canvas">
            <div id="canvas">
                <h3 class="card-header d-flex justify-content-between align-items-center">Services
                    <button v-if="$store.state.loggedIn && $store.state.role == 'admin'" class="btn btn-outline-success text=right" title="Create Service" @click="createService()"><i class="bi bi-plus-square"></i></button>
                </h3>
                <hr/>
                <div class="table-responsive small">
                    <table class="table table-striped table-sm" id="all-services">
                        <thead style="font-size: 14px;">
                            <tr>
                                <th class="bg-primary text-white text-center" valign="middle">Name</th>
                                <th class="bg-primary text-white text-center" valign="middle">Description</th>
                                <th class="bg-primary text-white text-center" valign="middle">Base Price (₹)</th>
                                <th class="bg-primary text-white text-center" valign="middle">Time Required (hrs)</th>
                                <th class="bg-primary text-white text-center" valign="middle">Cateogory</th>
                                <th class="bg-primary text-white text-center" valign="middle">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="service in services" :key="service.id">
                                <td>{{service.name}}</td>
                                <td>{{service.description}}</td>
                                <td align="right">{{service.base_price}}</td>
                                <td align="right">{{service.time_required}}</td>
                                <td>{{service.servicecategory.name}}</td>
                                <td>
                                    <div class="btn-group mr-2">
                                        <button v-if="$store.state.loggedIn && $store.state.role == 'customer'" class="btn btn-outline-primary" title="Select Service" @click="selectService(service.id, service.name)"><i class="bi bi-check2-square"></i></button>                                    
                                        <button v-if="$store.state.loggedIn && $store.state.role == 'admin'" class="btn btn-outline-secondary" title="Update Service" @click="updateService(service.id)"><i class="bi bi-arrow-clockwise"></i></button>
                                        <button v-if="$store.state.loggedIn && $store.state.role == 'admin'" class="btn btn-outline-danger" title="Delete Service" @click="deleteService(service.id)"><i class="bi bi-trash"></i></button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        <component-modal ref="componentModal"></component-modal>
        <generic-dialogue ref="genericDialogue"></generic-dialogue>
    </div>
`, 

  data(){
    return{
        services : [],
        tile : "All Services",
    };
  },

  components: { GenericDialogue, ComponentModal},
  
  methods: {
    
    async fetchData(){
        let url = location.origin + "/api/services";
        if (this.serviceCategoryId >= 1) {
            url = url + "?servicecategoryid=" + this.serviceCategoryId.toString()
        }
        const res = await fetch(url,{
            headers : {
                "Authentication-Token" : this.$store.state.auth_token
            }
        })
        this.services = await res.json()
    },

    async createService() {
        const ok = await this.$refs.componentModal.show({
            okButton : 'Create',
            cancelButton : "Cancel",
            modalComponent : ServiceDetails,
            componentId : -1,
            params : {"purpose" : "create"},            
        });
        
        if (ok) {
            const ok = await this.$refs.genericDialogue.show({
                title : 'Create Service',
                message : 'Your request to create service is completed...',
                confirmButtonStyle : "btn btn-success",
                confirmButtonText : "OK",
                confirmButtonDisplay : true,
                cancelButtonStyle : "",
                cancelButtonText: "",                    
                cancelButtonDisplay : false,
            })
            
            this.fetchData();
        }
    },


    async updateService(service_id) {
        const ok = await this.$refs.componentModal.show({
            okButton : 'Update',
            cancelButton : "Cancel",
            modalComponent : ServiceDetails,
            componentId : service_id,
            params : {"purpose" : "update"},            
        });

        if (ok) {
            const ok = await this.$refs.genericDialogue.show({
                title : 'Update Service',
                message : 'Your request to update service is completed...',
                confirmButtonStyle : "btn btn-success",
                confirmButtonText : "OK",
                confirmButtonDisplay : true,
                cancelButtonStyle : "",
                cancelButtonText: "",                    
                cancelButtonDisplay : false,
            })  
            this.fetchData();
        }
    },

    async deleteService(service_id) {
        const ok = await this.$refs.genericDialogue.show({
            title : 'Delete Service',
            message : 'Are you sure you want to delete the service? It cannot be undone.',
            confirmButtonStyle : "btn btn-danger",
            confirmButtonText : "Delete Forever",
            confirmButtonDisplay : true,
            cancelButtonStyle : "btn btn-secondary",
            cancelButtonText: "Go Back",                    
            cancelButtonDisplay : true,
        })  
        if (ok) {
            const res = await fetch(location.origin + "/api/services/" + service_id.toString(),{
                method : "DELETE",
                headers : {
                    "Authentication-Token" : this.$store.state.auth_token
                }
            });
            
            this.fetchData();
        } 
    },

    async selectService(service_id, service_name) {
        const ok = await this.$refs.componentModal.show({
            okButton : 'Create',
            cancelButton : "Cancel",
            modalComponent : BookingDetails,
            componentId : -1,
            params : {"purpose" : "create", "service_id" : service_id, "service_name" : service_name},
        });

        if (ok){
            const ok = await this.$refs.genericDialogue.show({
                title : 'Create Booking',
                message : 'Your request to create booking is completed...',
                confirmButtonStyle : "btn btn-success",
                confirmButtonText : "OK",
                confirmButtonDisplay : true,
                cancelButtonStyle : "",
                cancelButtonText: "",                    
                cancelButtonDisplay : false,
            })  
            this.$emit('createBookingEvent');
        }
    },
  },
  async mounted(){
    this.fetchData();
  },
}