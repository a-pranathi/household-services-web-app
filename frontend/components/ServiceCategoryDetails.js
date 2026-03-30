export default {
    props : ["id", "params"],
      template : `
        <div class="container mt-3 p-2">
            <h2>Service Category details</h2>
            <hr/>
            <div class="form-floating mt-2">
              <input type="text" class="form-control" id="nameField" v-model="serviceCategory.name" required :disabled="disableCheck"></input>
              <label for="nameField">Name</label>
            </div>
            <div class="form-floating mt-2">
              <input type="text" class="form-control" id="descriptionField" v-model="serviceCategory.description" required :disabled="disableCheck"></input>
              <label for="descriptionField">Description</label>
            </div>
        </div>
         `,
  
      data(){
        return {
          serviceCategory : {
            id  : -1,
            name : "",
            description : "",
          },

          disableCheck : false,
        };
      },
  
      methods: {
      
        async confirm() {
        
        if (this.params.purpose === "view") {
          alert("Inside select confirm...");
          
        }
        else {
          let url = location.origin + "/api/servicecategories";
          let httpBody = JSON.stringify(this.serviceCategory);
          let httpMethod = "POST";
  
          if (this.serviceCategory.id > 0) {
            url = url + "/" + this.serviceCategory.id.toString(); 
            httpMethod = "PUT";
          } 
  
          const res = await fetch(url,
          { 
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
  
      async mounted(){
        if (this.id != -1) {
            const res = await fetch(`${location.origin}/api/servicecategories/${this.id}`, {
                headers : {
                    'Authentication-Token' : this.$store.state.auth_token
                }
            })
            if (res.ok){
                this.service = await res.json();
            }
        }
        
        if (this.params.purpose === "view") {
         this.disableCheck = true;
        }
     }
  }
    