export default {
    template : `
        <transition name="fade" >
            <div class="popup-modal" v-if="isVisible" >
                <div class="window" >
                    <slot ></slot>
                </div>
            </div>
        </transition>
`,

    data: () => ({
        isVisible: false,
    }),

    methods: {
        open() {
            this.isVisible = true
        },

        close() {
            this.isVisible = false
        },
    },
}
