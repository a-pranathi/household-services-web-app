import GenericCard from "./GenericCard.js";
import ComponentModal from "./ComponentModal.js";
import GenericDialogue from "./GenericDialogue.js";
import ServiceCategoryDetails from "./ServiceCategoryDetails.js";

export default {
  template : `
    <div class="container">
      <div class="row">
        <GenericCard @selectedCardEvent="handleEvent" v-bind:key="-1" id="-1" name="All Services" description="Show all available services from the server..." :cardBackground="getBackgroundURL(4)" />
        <GenericCard v-for="(servicecategory, index) in servicecategories" @selectedCardEvent="handleEvent" v-bind:key="servicecategory.id" :id="servicecategory.id" :name="servicecategory.name" :description="servicecategory.description" :cardBackground="getBackgroundURL(index)" />
        <GenericCard v-if="$store.state.loggedIn && $store.state.role == 'admin'" @selectedCardEvent="handleEvent" v-bind:key="-100" id="-100" name="Add Service Category" description="Create a new service category..." :cardBackground="getBackgroundURL(2)" />
      </div>
      <ComponentModal ref="componentModal"></ComponentModal>
      <GenericDialogue ref="genericDialogue"></GenericDialogue>      
    </div>
`, 

  data(){
    return{
        servicecategories : [],
        imageLibrary : [
          "/static/images/ionic-native-card.png",
          "/static/images/components-card.png",
          "/static/images/theming-card.png",
          "/static/images/component-gears.png",
          "/static/images/demand_house.png",
          "/static/images/retailer_house.png",                  
        ],
    };
  },
  
  components : {GenericCard, ComponentModal, GenericDialogue},

  methods : {

    async fetchData(){
      const res = await fetch(location.origin + "/api/servicecategories",{
        headers : {
            "Authentication-Token" : this.$store.state.auth_token
        }
    })

    this.servicecategories = await res.json()
  },

      async handleEvent(serviceCategoyId){
        if (serviceCategoyId == "-100") {
           
          const ok = await this.$refs.componentModal.show({
                okButton : 'Create',
                cancelButton : "Cancel",
                modalComponent : ServiceCategoryDetails,
                componentId : -1,
                params : {"purpose" : "create"},            
            });
            
            if (ok) {
                const ok = await this.$refs.genericDialogue.show({
                    title : 'Create Service Category',
                    message : 'Your request to create service Category is completed...',
                    confirmButtonStyle : "btn btn-success",
                    confirmButtonText : "OK",
                    confirmButtonDisplay : true,
                    cancelButtonStyle : "",
                    cancelButtonText: "",                    
                    cancelButtonDisplay : false,
                })
              }
              this.fetchData();
            }
            else {
          this.$emit('servicecategorySelectEvent', serviceCategoyId);
        }
      },

      getBackgroundURL(index){
        const validIndex = index % this.imageLibrary.length;
        return this.imageLibrary[validIndex];
      },

      getRandomBackgroundURL(index){
        const randomIndex = Math.floor(Math.random() * this.imageLibrary.length);
        const returnValue = this.imageLibrary[randomIndex];
    
        return returnValue;
      }
    },

  async mounted(){
    this.fetchData();
  }
}