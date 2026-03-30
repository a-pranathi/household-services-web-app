export default {
  props : ["id", "params"],
    template : `
      <div class="container mt-3 p-2">
          <h2>Service details</h2>
          <hr/>
          <div class="form-floating mt-2">
            <input type="text" class="form-control" id="nameField" v-model="service.name" required :disabled="disableCheck"></input>
            <label for="nameField">Name</label>
          </div>
          <div class="form-floating mt-2">
            <input type="text" class="form-control" id="descriptionField" v-model="service.description" required :disabled="disableCheck"></input>
            <label for="descriptionField">Description</label>
          </div>
          <div class="form-floating mt-2">
            <input type="text" class="form-control" id="basePriceField" v-model="service.base_price" required :disabled="disableCheck"></input>
            <label for="basePriceField">Base Price</label>
          </div>
          <div class="form-floating mt-2">
            <input type="text" class="form-control" id="timeRequiredField" v-model="service.time_required" required :disabled="disableCheck"></input>
            <label for="timeRequiredField">Time Required</label>
          </div>
          <div class="form-floating mt-2">
            <select class="form-select" id="serviceCategoryIdField" v-model="service.category_id" required :disabled="disableCheck">
              <option v-for="servicecategory in serviceCategories" :value="servicecategory.id">{{servicecategory.name}}</option>
            </select>
            <label for="serviceCategoryIdField">Service Category</label>
          </div>
          <div class="form-floating mt-2">
            <input type="text" class="form-control" id="createdAtField" v-model="service.created_at" disabled></input>
            <label for="createdAtField">Created</label>
          </div>
          <div class="form-floating mt-2">
            <input type="text" class="form-control" id="updatedAtField" v-model="service.updated_at" disabled></input>
            <label for="updatedAtField">Updated</label>
          </div>        
      </div>
       `,

    data(){
      return {
        service : {
          id  : -1,
          name : "",
          description : "",
          base_price : null,
          time_required : null,
          category_id : null,
          category_name : "",
          created_at : null,
          updated_at : null,
        },
        serviceCategories : [],
        disableCheck : false,
      };
    },

    methods: {
    
      async confirm() {
      
      if (this.params.purpose === "view") {
        alert("Inside select confirm...");
        
      }
      else {  
        let url = location.origin + "/api/services";
        let httpBody = JSON.stringify(this.service);
        let httpMethod = "POST";

        if (this.service.id != -1) {
          url = url + "/" + this.service.id.toString(); 
          httpMethod = "PUT";
        } 

        const res = await fetch(url, { 
          method : httpMethod,
          headers : {"Content-type" : "application/json",
          'Authentication-Token' : this.$store.state.auth_token
          },
          body : httpBody,
        })

        if (res.ok){
          const data = await res.json()
        }
      }
    },
  },
    computed : {
        formattedCreateDate(){
            return new Date(this.service.created_at).toLocaleString();
        }
    },
    computed : {
      formattedCreateDate(){
          return new Date(this.service.updated_at).toLocaleString();
      }
    }, 

    async mounted(){
      if (this.id != -1) {
          const res = await fetch(`${location.origin}/api/services/${this.id}`, {
              headers : {
                  'Authentication-Token' : this.$store.state.auth_token
              }
          })
          if (res.ok){
              this.service = await res.json();
          }
      }
    
      const res = await fetch(`${location.origin}/api/servicecategories`, {
          headers : {
              'Authentication-Token' : this.$store.state.auth_token
          }
      });
      if (res.ok){
          this.serviceCategories = await res.json();
      };

      if (this.params.purpose === "view") {
       this.disableCheck = true;
      }
   }
}
  