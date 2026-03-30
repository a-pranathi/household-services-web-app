import GenericCard from "../components/GenericCard.js"

export default {
    template : `

    <div class="container mt-2">
        <div class="card mt-2 p-2">
            <h3 class="text-primary text-center" > Welcome to the Admin dashboard!</h3>
        </div>

        <div class="card mt-2 p-2">
            <div class="row">
                <GenericCard v-for="card in cards" @selectedCardEvent="handleEvent" v-bind:key="card.link" :name="card.name" :description="card.description" :id="card.link" :cardBackground="card.backgroundImange" />                
            </div>
        </div>
    </div>
    `, 

    components : {
        GenericCard,
      },
      
    data() {
         return {
            cards : [
              {
                name : "User Management", 
                description : "Complete user management for customers, professionals including thier login status",
                link : "/users",
                backgroundImange : "/static/images/ionic-native-card.png",                
              },
              {
                name : "Service Management", 
                description : "Manage Service Categories, Services and more!",
                link : "/services",
                backgroundImange : "/static/images/components-card.png",                
              },
              {
                name : "Booking Management", 
                description : "Review all bookings and their current status!",
                link : "/bookings",
                backgroundImange : "/static/images/theming-card.png",                
              },
              {
                name : "Downloads", 
                description : "Download CSV files for various artifacts!",
                link : "/downloads",
                backgroundImange : "/static/images/demand_house.png",                
              },              
              {
                name : "Configuration", 
                description : "Configuration system parameters!",
                link : "/configuration",
                backgroundImange : "/static/images/component-gears.png",                
              },              
            ],
        }
    },
     
    methods : {

        handleEvent(link){
            this.$router.push(link)
          },        

        async fetch_csv(){
            const res = await fetch(location.origin + '/create-csv', {
                headers : {
                    'Authentication-Token' : this.$store.state.auth_token
                }
            })
            const task_id = (await res.json()).task_id

            const interval = setInterval(async() => {
                const res = await fetch(`${location.origin}/get-csv/${task_id}` )
                if (res.ok){
                    window.open(`${location.origin}/get-csv/${task_id}`)
                    clearInterval(interval)
                }

            }, 100)   
        },
    },
}