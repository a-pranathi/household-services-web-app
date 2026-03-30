import GenericDialogue from "./GenericDialogue.js";
import ComponentModal from "./ComponentModal.js";
import BookingDetails from "./BookingDetails.js";
import ReviewDetails from "./ReviewDetails.js";

export default {
    props : ["params"],
  template : `
    <div class="container">
        <div id="background-canvas">
            <div class="card m-2 p-2">
                <h3 class="card-header d-flex justify-content-between align-items-center">Bookings</h3>
                <hr/>
                <div class="table-responsive small">
                    <table class="table table-striped table-sm" id="all-bookings">
                        <thead style="font-size: 14px;">
                            <tr>
                                <th class="bg-primary text-white text-center" valign="middle">Customer</th>
                                <th class="bg-primary text-white text-center" valign="middle">Service</th>
                                <th class="bg-primary text-white text-center" valign="middle">Professional</th>
                                <th class="bg-primary text-white text-center" valign="middle">Booking Date</th>
                                <th class="bg-primary text-white text-center" valign="middle">Service Date</th>
                                <th class="bg-primary text-white text-center" valign="middle">Status</th>
                                <th class="bg-primary text-white text-center" valign="middle">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="booking in bookings" :key="booking.id">
                                <td>{{booking.customer.name}}</td>
                                <td>{{booking.service.name}}</td>
                                <td>{{booking.professional.name}}</td>
                                <td>{{getFormattedDate(booking.booking_date)}}</td>
                                <td>{{booking.service_date}}</td>
                                <td>{{booking.status}}</td>
                                <td>
                                    <div class="btn-group mr-2">
                                        <button v-if="$store.state.loggedIn && $store.state.role == 'customer' && booking.status == 'request'" class="btn btn-outline-primary" title="Update Booking" @click="updateBooking(booking.id, 'request')"><i class="bi bi-arrow-clockwise"></i></button>
                                        <button v-if="$store.state.loggedIn && $store.state.role == 'customer' && booking.status == 'request'" class="btn btn-outline-danger" title="Delete Booking" @click="deleteBooking(booking.id)"><i class="bi bi-trash"></i></button>                                        
                                        <button v-if="$store.state.loggedIn && $store.state.role == 'customer' && booking.status == 'confirm'" class="btn btn-outline-primary" title="Close Booking" @click="updateBooking(booking.id, 'close')"><i class="bi bi-check2-all"></i></button>
                                        <button v-if="$store.state.loggedIn && $store.state.role == 'customer' && booking.status == 'close'" class="btn btn-outline-success" title="Review Booking" @click="createReview(booking)"><i class="bi bi-chat-heart-fill"></i></button>
                                        <button v-if="$store.state.loggedIn && $store.state.role == 'professional' && booking.status == 'request'" class="btn btn-outline-secondary" title="Confirm Service" @click="updateBooking(booking.id, 'confirm')"><i class="bi bi-check-circle-fill"></i></button>
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
        bookings : [],
    };
  },

  components: { GenericDialogue, ComponentModal},
  
  methods: {
    getFormattedDate(datetoFormat){
        if (datetoFormat){
            return new Date(datetoFormat).toLocaleString();
        }
        else{
            return ""
        }
    },    
    async fetchData(){
        let filterKey = "";

        if (this.$store.state.loggedIn && this.$store.state.role == 'admin'){
            filterKey = "admin";
        }
        else
            filterKey = this.params.filter;

        let url = location.origin + "/api/bookings" + "?filter=" + filterKey;

        const res = await fetch(url,
            { 
              headers : {
                "Content-type" : "application/json",
                'Authentication-Token' : this.$store.state.auth_token
              },
            }
        );
 
        this.bookings = await res.json();
    },

    async updateBooking(booking_id, action) {
        const ok = await this.$refs.componentModal.show({
            okButton : 'Accept',
            cancelButton : "Cancel",
            modalComponent : BookingDetails,
            componentId : booking_id,
            params : {"purpose" : "update", "action" : action},
        });

        if (ok){
            const ok = await this.$refs.genericDialogue.show({
                title : 'Update Booking',
                message : 'Your request to update booking is completed...',
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
  
    async deleteBooking(booking_id) {
        const ok = await this.$refs.genericDialogue.show({
            title : 'Delete booking',
            message : 'Are you sure you want to delete the booking? It cannot be undone.',
            confirmButtonStyle : "btn btn-danger",
            confirmButtonText : "Delete Forever",
            confirmButtonDisplay : true,
            cancelButtonStyle : "btn btn-secondary",
            cancelButtonText: "Go Back",                    
            cancelButtonDisplay : true,
        })  
        if (ok) {
            const res = await fetch(location.origin + "/api/bookings/" + booking_id.toString(),{    
                method : "DELETE",    
                headers : {
                    "Content-type" : "application/json",
                    'Authentication-Token' : this.$store.state.auth_token
                    },
                  });
                 
            this.fetchData();
        }
    },

    async createReview(booking) {
        const ok = await this.$refs.componentModal.show({
            okButton : 'Create',
            cancelButton : "Cancel",
            modalComponent : ReviewDetails,
            componentId : -1,
            params : {"purpose" : "create", "booking" : booking},
        });

        if (ok){
            const ok = await this.$refs.genericDialogue.show({
                title : 'Create Review',
                message : 'Your request to create review is completed...',
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
  },

  async mounted(){
    this.fetchData();
  },
}