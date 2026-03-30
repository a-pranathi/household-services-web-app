import PopupModal from "./PopupModal.js"

export default {
    template : `
        <popup-modal ref="popup">
        <div class="container mt-3"
            <button class="btn" style="float:right;" @click="_cancel"><i class="bi bi-x-square"></i></button>
            <h2>{{ title }}</h2>
            <hr/>
            <p class="fs-4 p-2">{{ message }}</p>
            <div class="container mt-3 p-2">
                <button :class="cancelButtonStyle" v-show="cancelButtonDisplay" @click="_cancel">{{ cancelButtonText }}</button>
                <button :class="confirmButtonStyle" v-show="confirmButtonDisplay" @click="_confirm">{{ confirmButtonText }}</button>
            </div>
        </div>
        </popup-modal>
    `,

    components: { PopupModal },

    data: () => ({
        title : undefined,
        message : undefined,
        confirmButtonStyle : undefined,
        confirmButtonText: undefined,
        confirmButtonDisplay : true,
        cancelButtonStyle : "btn btn-secondary",
        cancelButtonText: "Go Back",
        cancelButtonDisplay : false,

        resolvePromise: undefined,
        rejectPromise: undefined,
    }),

    methods: {
        show(opts = {}) {
            this.title = opts.title
            this.message = opts.message

            this.confirmButtonStyle = opts.confirmButtonStyle
            this.confirmButtonText = opts.confirmButtonText
            this.confirmButtonDisplay = opts.confirmButtonDisplay

            this.cancelButtonDisplay = opts.cancelButtonDisplay 

            if (opts.cancelButtonStyle){
                this.cancelButtonStyle = opts.cancelButtonStyle
            }

            if (opts.cancelButtonText) {
                this.cancelButtonText = opts.cancelButtonText
            }
    
            this.$refs.popup.open()
            return new Promise((resolve, reject) => {
                this.resolvePromise = resolve
                this.rejectPromise = reject
            })
        },

        _confirm() {
            this.$refs.popup.close()
            this.resolvePromise(true)
        },

        _cancel() {
            this.$refs.popup.close()
            this.resolvePromise(false)
        },
    },
}
