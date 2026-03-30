import PopupModal from "./PopupModal.js"

export default {
    template : `
        <popup-modal ref="popup">
            <div class="container mt-3">
               <button class="btn" style="float:right;" @click="_cancel"><i class="bi bi-x-square"></i></button>
                <component :is="modalComponent" v-bind:key="componentId" :id="componentId" :params="params" ref="modalComponentRef"></component>
              
                <div class="container mt-3 p-2">
                    <button class="btn btn-secondary" @click="_cancel">{{ cancelButton }}</button>
                    <button class="btn btn-success" @click="_confirm">{{ okButton }}</button>
                </div>
            </div>
        </popup-modal>
    `,

    components: { PopupModal },

    data: () => ({
        okButton : undefined,
        cancelButton : 'Go Back',
        modalComponent : undefined,
        componentId : undefined,
        params : undefined,

        resolvePromise: undefined,
        rejectPromise: undefined,
    }),

    methods: {
        show(opts = {}) {
            this.okButton = opts.okButton
            if (opts.cancelButton) {
                this.cancelButton = opts.cancelButton
            }
            this.modalComponent = opts.modalComponent
            this.componentId = opts.componentId
            this.params = opts.params
            
            this.$refs.popup.open()
            return new Promise((resolve, reject) => {
                this.resolvePromise = resolve
                this.rejectPromise = reject
            })
        },

        _confirm() {
            this.$refs.modalComponentRef.confirm()
            this.$refs.popup.close()
            this.resolvePromise(true)
        },

        _cancel() {
            this.$refs.popup.close()
            this.resolvePromise(false)
        },
    },
}