export default {
    props : ["id", "params"],
      template : `
        <div class="container mt-3 p-2">
            <h2>Booking details</h2>
            <hr/>
            <div class="form-floating mt-2">
              <input type="text" class="form-control" id="customerNameField" v-model="booking.customer.name" required disabled></input>
              <label for="customerNameField">Customer Name</label>
            </div>
            <div class="form-floating mt-2">
              <input type="text" class="form-control" id="serviceField" v-model="booking.service.name" required disabled></input>
              <label for="serviceField">Service Name</label>
            </div>
            <div class="form-floating mt-2">
              <input type="text" class="form-control" id="professionalNameField" v-model="booking.professional.name" disabled></input>
              <label for="professionalNameField">Professional Name</label>
            </div>
            <div class="form-floating mt-2">
              <input type="date" class="form-control" id="bookingDateField" v-model="booking.booking_date" required :disabled="disableCheck"></input>
              <label for="bookingDateField">Booking Date (dd-mm-yyyy)</label>
            </div>
            <div class="form-floating mt-2">
              <input type="date" class="form-control" id="serviceDateField" v-model="booking.service_date" disabled></input>
              <label for="serviceDateField">Service Date</label>
            </div>
            <div class="form-floating mt-2">
              <input type="text" class="form-control" id="statusField" v-model="booking.status" required disabled></input>
              <label for="statusField">status</label>
            </div>
            <div class="form-floating mt-2">
              <input type="text" class="form-control" id="remarksField" v-model="booking.remarks" required :disabled="disableCheck"></input>
              <label for="remarksField">Remarks</label>
            </div>
        </div>
         `,
  
      data(){
        return {
          booking : {
            id : null,
            customer_id : null,
            service_id : null,
            professional_id : null,
            booking_date : null,
            service_date : null,
            status : null,
            remarks : null,        
            customer : {
              name : null, 
            },
            service : {
              name : null,
            },
            professional : {
              name : null,
            },
          },

          disableCheck : false,
        };
      },
  
      methods: {
        formatDateForInput(dateString) { 
          const date = new Date(dateString);
          return date.toISOString().split('T')[0];
        },
        formatDateForServer(dateString) {
          const date = new Date(dateString);
          return date.toISOString();
        },        

        async confirm() {
          if (this.params.purpose === "view") {
            alert("Inside select confirm...");
            
          }
          else{            
            let url = location.origin + "/api/bookings";
            this.booking.status = this.params.action;

            if (this.params.purpose === "update" && this.params.action === "confirm"){
             this.booking.professional_id = this.$store.state.id;
            }
            let httpBody = JSON.stringify(this.booking);
            let httpMethod = "POST";
            
            if (this.booking.id != -1) {
              url = url + "/" + this.booking.id.toString(); 
              httpMethod = "PUT";
            } 
    
            const res = await fetch(url,
            { 
              method : httpMethod,
              headers : {"Content-type" : "application/json",
              "Authentication-Token" : this.$store.state.auth_token,
              },
              body : httpBody,
            })
    
            if (res.ok){
              this.booking = await res.json()
            }
          }
        }
      },
  
      async mounted(){
        if (this.params.purpose === "create") {
          this.disableCheck = false;
          this.booking.id = -1
          this.booking.customer_id = this.$store.state.id
          this.booking.service_id = this.params.service_id
          this.booking.status = "request"
          this.booking.customer.name = this.$store.state.name
          this.booking.service.name = this.params.service_name  
         }

        if (this.id != -1) {
            const res = await fetch(`${location.origin}/api/bookings/${this.id}`, {
                headers : {
                    'Authentication-Token' : this.$store.state.auth_token
                }
            })
            if (res.ok){
                this.booking = await res.json();
                this.booking.booking_date = this.formatDateForInput(this.booking.booking_date);
            }
        }
        if ((this.params.purpose === "create") ||
         (this.params.purpose === "update" && this.params.action === "request")){
          this.disableCheck = false;      
        }
        else {
          this.disableCheck = true;
        }
     }
  }
    