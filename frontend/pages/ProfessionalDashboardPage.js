import BookingList from "../components/BookingList.js";

export default {
    template : `
    <div class="container">
        <div class="card m-1     p-2">
            <h3 class="text-primary text-center" > Welcome {{this.$store.state.name}} to the Professional dashboard!</h3>
        </div>
        <div class="card m-1 p-2">
            <BookingList ref="bookingList" :params="{'filter' : 'request'}"/>
        </div>
        <div class="card m-1 p-2">
            <BookingList ref="bookingList" :params="{'filter' : 'professional'}"/>
        </div>
    </div>
    `,
    
    components : {
        BookingList,
    },
    
    methods : {
        },
 }