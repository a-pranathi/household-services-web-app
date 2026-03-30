export default {
    props : ["id", "name", "description", "cardBackground"],
    template : `
        <div class="col-md-4 p-2" @click="$emit('selectedCardEvent', id)">
            <div ref="categorycard" class="carddynamic carddynamic-background">
                <h3>{{name}}</h3>
                <p>{{description}}</p>
            </div>
        </div>
    `,
    async mounted(){
         this.$refs.categorycard.style.backgroundImage = `url(${this.cardBackground})`;
        },    
}