import { defineComponent } from "vue"

const SimpleThreadView = defineComponent({
    props: {
        thread: Object,
    },
    

    setup(props) {


        return function render() {
            return (
                <div class="thread">
                    <div class="thread-header">
                        <span class="time">{props.thread.time}</span>
                    </div>
                    <div class="thread-content">
                        <a>{props.thread.subject}</a>
                        <p>Poster: {props.thread.username}</p>
                    </div>
                </div>
            );
        };
    },
});

export default SimpleThreadView; 