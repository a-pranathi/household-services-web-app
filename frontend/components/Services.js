import ServiceCategoryList from "./ServiceCategoryList.js"
import ServiceList from "./ServiceList.js"

export default {
    template : `

    <div class="container mt-2">
        <div class="card mt-2 p-2">
            <h3 class="text-primary text-center" > Welcome to the Services Page!</h3>
        </div>
        <div class="card mt-2 p-3">
            <ServiceCategoryList @servicecategorySelectEvent="handleEvent"/>
        </div>
        <div class="card mt-2 p-3">
            <ServiceList :key="serviceCategoryId" :serviceCategoryId="serviceCategoryId"/>
        </div>
    </div>
    `, 

    data(){
        return{
            serviceCategoryId : -1,
        };
      },

    methods : {
        handleEvent(serviceCategoryId){
            this.serviceCategoryId = serviceCategoryId;
          },
    },

    components : {
        ServiceCategoryList,
        ServiceList,
    }
}