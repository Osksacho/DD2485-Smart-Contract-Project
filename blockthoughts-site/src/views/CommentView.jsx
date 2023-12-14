import { defineComponent } from 'vue';

const CommentView = defineComponent({
    props: {
        comment: Object,
    },

    setup(props) {
        return function render() {
            return (
                <div class="comment">
                    <div class="comment-header">
                        <span class="time">{props.comment.time}</span>
                    </div>
                    <div class="comment-content">
                        <a>{props.comment.text}</a>
                        <p>{props.comment.username}</p>
                        {/* Display other details of the comment */}
                    </div>
                </div>
            );
        };
    },
});

export default CommentView;