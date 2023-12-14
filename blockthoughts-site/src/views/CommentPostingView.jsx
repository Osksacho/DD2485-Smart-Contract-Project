import { defineComponent, ref } from "vue"

const CommentPostingView = defineComponent({
    props: {
        model: Object,
    },

    setup(props) {
        const commentText = ref("");

        const postComment = () => {
            if (commentText.value.length != 0) {
                props.model.addComment(commentText.value);
                
                commentText.value = "";
            } else {
                console.error('Comment cannot be empty');
            }
        };

        return { commentText, postComment };
    },
    render() {
        return (
            <div>
                <div class="input-container">
                    <input
                        type="text"
                        v-model={this.commentText}
                        placeholder="Enter a comment here..."
                        class="input"
                    />
                    <button type="submit" onClick={this.postComment}>Post</button>
                </div>
            </div>
        );
    },
});

export default CommentPostingView; 