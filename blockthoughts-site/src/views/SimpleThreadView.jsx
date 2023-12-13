import { defineComponent } from "vue"

const SimpleThreadView = defineComponent({
    props: {
        thread: Object,
    },

    setup(props) {
        return function render() {
            return (
                <div class="thread">
                    <a>{props.thread.subject}</a>
                    <p>Poster: {"props.thread.username"}</p>
                </div>
            );
        };
    },
});

export default SimpleThreadView; 