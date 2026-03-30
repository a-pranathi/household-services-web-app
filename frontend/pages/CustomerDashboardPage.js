import ServiceCategoryList from "../components/ServiceCategoryList.js"
import ServiceList from "../components/ServiceList.js"
import BookingList from "../components/BookingList.js";

export default {
    template : `

    <div class="container mt-2">
        <div class="card mt-2 p-2">
            <h3 class="text-primary text-center" > Welcome {{this.$store.state.name}} to the Customer dashboard!</h3>
        </div>
        <div class="card mt-2 p-3">
            <BookingList ref="bookingList" :params="{'filter' : 'customer'}"/>            
        </div>
    </div>
    `, 

    data(){
        return{
            serviceCategoryId : -1,
        };
      },

    methods : {
        handleSelectCategoryEvent(serviceCategoryId){
            this.serviceCategoryId = serviceCategoryId;
          },
        handleCreateBooking(){
            this.$refs.bookingList.fetchData()
        }
    },

    components : {
        ServiceCategoryList,
        ServiceList,
        BookingList,
    }
}