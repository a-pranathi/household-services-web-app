
export default {
    template : `

    <div class="container mt-2">
        <div class="card mt-2 p-2">
            <h3 class="text-primary text-center" > Welcome to the Downloads Page!</h3>
        </div>
        <div class="card mt-5 p-2">
            <div class="row">
                <div class="card text-white bg-primary m-3 p-2" style="max-width: 18rem;" @click="fetch_csv('users')">
                    <div class="card-body">
                        <h5 class="card-title">Users</h5>
                        <p class="card-text">Download User data</p>
                    </div>
                </div>
                <div class="card text-white bg-secondary m-3 p-2" style="max-width: 18rem;" @click="fetch_csv('servicecategories')">
                    <div class="card-body">
                        <h5 class="card-title">Service Categories</h5>
                        <p class="card-text">Download service category data</p>
                    </div>
                </div>
                <div class="card text-white bg-success m-3 p-2" style="max-width: 18rem;" @click="fetch_csv('services')">
                    <div class="card-body">
                        <h5 class="card-title">Services</h5>
                        <p class="card-text">Download services data</p>
                    </div>
                </div>
                <div class="card text-white bg-info m-3 p-2" style="max-width: 18rem;" @click="fetch_csv('bookings')">
                    <div class="card-body">
                        <h5 class="card-title">Bookings</h5>
                        <p class="card-text">Download bookings data</p>
                    </div>
                </div>
                <div class="card text-white bg-warning m-3 p-2" style="max-width: 18rem;" @click="fetch_csv('reviews')">
                    <div class="card-body">
                        <h5 class="card-title">Reviews</h5>
                        <p class="card-text">Download reviews data</p>
                    </div>
                </div>                                                                
            </div>
        </div>
    </div>
    `, 

     
    methods : {
        async fetch_csv(artifactType){
            const res = await fetch(location.origin + '/api/download/create/' + artifactType.toString(), {
                headers : {
                    'Authentication-Token' : this.$store.state.auth_token
                }
            })
            const task_id = (await res.json()).task_id

            const interval = setInterval(async() => {
                const res = await fetch(`${location.origin}/api/download/checkstatus/${task_id}`,{
                    headers : {
                        'Authentication-Token' : this.$store.state.auth_token
                    }
                })
                if (res.ok){
                    window.open(`${location.origin}/api/download/file/${task_id}`)
                    clearInterval(interval)
                }

            }, 100)   
        },
    },
}