export default {
    props : ["id", "params"],
      template : `
        <div class="container mt-3 p-2">
            <h2>Review details</h2>
            <hr/>
            <div class="form-floating mt-2">
              <input type="text" class="form-control" id="customerNameField" v-model="review.booking.customer.name" required disabled></input>
              <label for="customerNameField">Customer Name</label>
            </div>
            <div class="form-floating mt-2">
              <input type="text" class="form-control" id="serviceField" v-model="review.booking.service.name" required disabled></input>
              <label for="serviceField">Service Name</label>
            </div>
            <div class="form-floating mt-2">
              <input type="text" class="form-control" id="professionalNameField" v-model="review.booking.professional.name" disabled></input>
              <label for="professionalNameField">Professional Name</label>
            </div>
            <div class="form-floating mt-2">
              <input type="text" class="form-control" id="bookingDateField" v-model="review.booking.booking_date" disabled></input>
              <label for="bookingDateField">Booking Date</label>
            </div>
            <div class="form-floating mt-2">
              <input type="text" class="form-control" id="serviceDateField" v-model="review.booking.service_date" disabled></input>
              <label for="serviceDateField">Service Date</label>
            </div>
            <div class="form-floating mt-2">
              <div class="btn-group mr-2">
                <button v-if="$store.state.loggedIn && $store.state.role == 'customer'" class="btn btn-light" title="Review Booking">Review Booking: </button>
                <button v-if="$store.state.loggedIn && $store.state.role == 'customer'" class="btn btn-outline-danger" title="Review Booking - Awful" @click="setRating(1)"><i class="bi bi-1-square-fill"></i></button>
                <button v-if="$store.state.loggedIn && $store.state.role == 'customer'" class="btn btn-outline-warning" title="Review Booking - Not Good" @click="setRating(2)"><i class="bi bi-2-square-fill"></i></button>
                <button v-if="$store.state.loggedIn && $store.state.role == 'customer'" class="btn btn-outline-primary" title="Review Booking - Good" @click="setRating(3)"><i class="bi bi-3-square-fill"></i></button>
                <button v-if="$store.state.loggedIn && $store.state.role == 'customer'" class="btn btn-outline-info" title="Review Booking - Very Good" @click="setRating(4)"><i class="bi bi-4-square-fill"></i></button>
                <button v-if="$store.state.loggedIn && $store.state.role == 'customer'" class="btn btn-outline-success" title="Review Booking - Excellent" @click="setRating(5)"><i class="bi bi-5-square-fill"></i></button>
                <button v-if="$store.state.loggedIn && $store.state.role == 'customer'" class="btn btn-light" title="Selected Value">{{review.rating}}</button>                            
              </div>
            </div>
            <div class="form-floating mt-2">
              <textarea class="form-control" id="remarksField" v-model="review.remarks" required :disabled="disableCheck"></textarea>
              <label for="remarksField">Remarks</label>
            </div>
        </div>
         `,
  
      data(){
        return {
          review : {
            id : null,
            booking_id : null,
            rating : null,
            remarks : null,
            created_at : null,
            booking : {
                booking_date : null,
                service_date : null,
                customer : {
                name : null, 
                },
                service : {
                name : null,
                },
                professional : {
                name : null,
                },
            }
          },

          disableCheck : false,
        };
      },
  
      methods: {
 
        setRating(rating) {
            this.review.rating = rating
        },

        async confirm() {   
          if (this.params.purpose === "view") {
            
          }
          else{            
            let url = location.origin + "/api/reviews";
            let httpBody = JSON.stringify(this.review);
            let httpMethod = "POST";
            
            if (this.review.id != -1) {
              url = url + "/" + this.review.id.toString(); 
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
              this.review = await res.json()
            }
          }
        }
      },

      computed : {
          formattedCreateDate(){
              return new Date(this.review.booking.created_at).toLocaleString();
          }
      },
      computed : {
        formattedCreateDate(){
            return new Date(this.review.booking.updated_at).toLocaleString();
        }
      }, 
  
      async mounted(){
        if (this.params.purpose === "create") {
          this.disableCheck = false;
          this.review.id = -1

          this.review.booking_id = this.params.booking.id
          this.review.booking.customer.name = this.params.booking.customer.name
          this.review.booking.service.name = this.params.booking.service.name
          this.review.booking.professional.name = this.params.booking.professional.name
          this.review.booking.booking_date = this.params.booking.booking_date
          this.review.booking.service_date = this.params.booking.service_date
         }

        if (this.id != -1) {
            const res = await fetch(`${location.origin}/api/reviews/${this.id}`, {
                headers : {
                    'Authentication-Token' : this.$store.state.auth_token
                }
            })
            if (res.ok){
                this.review = await res.json();
            }
        }
     }
  }