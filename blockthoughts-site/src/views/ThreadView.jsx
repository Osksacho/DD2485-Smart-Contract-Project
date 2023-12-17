import { defineComponent } from "vue"
import CommentView from "./CommentView";
import CommentPoster from "../components/CommentPosterPresenter";

const ThreadView = defineComponent({
    props: {
        model: Object,
        thread: Object,
        return: Function,
    },

    setup(props) {
        props.model.getComments();
        console.log(props.model.currentThreadComments);

        return function render() {
            function handleReturnClick() {
                props.return();
            }

            function commentToView(comment) {
                return <CommentView comment={comment} />;
            }

            return (
                <div>
                    <button onClick={handleReturnClick}>Return</button>

                    <div class="thread">
                        <div class="thread-header">
                            <span class="time">{props.thread.time}</span>
                        </div>
                        <div class="thread-content">
                            <a>{props.thread.subject}</a>
                            <p>Poster: {props.thread.username}</p>
                        </div>
                    </div>

                    {props.model.currentThreadComments && props.model.currentThreadComments.length > 0 && (
                        <div class="comments-container">
                            {props.model.currentThreadComments
                                .slice()
                                .sort((a, b) => new Date(a.time) - new Date(b.time))
                                .map(commentToView)}
                        </div>
                    )}

                    <div>
                        <CommentPoster model={props.model} />
                    </div>
                </div>
            );
        };
    },
});

export default ThreadView; 