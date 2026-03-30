export default {
    props : ['id'],
    template : `
    <div>
        <h1> {{review.review_text}} </h1>
        <p> Booking Id : {{review.booking_id}} </p>
        <p> Customer Id : {{review.customer_id}} </p>
        <p> Provider Id : {{review.provider_id}} </p>
        <p> Rating : {{review.rating}} </p>
        <p> Published : {{formattedDate}} </p>
    </div>
    `,
    data(){
        return {
            review : {},
        }
    },
    computed : {
        formattedDate(){
            return new Date(this.review.created_at).toLocaleString();
        }
    },
    async mounted(){
        const res = await fetch(`${location.origin}/api/reviews/${this.id}`, {
            headers : {
                'Authentication-Token' : this.$store.state.auth_token
            }
        })
        if (res.ok){
            this.review = await res.json()
        }
    }
}