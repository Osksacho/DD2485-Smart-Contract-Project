import { defineComponent, ref } from "vue"

const CommentPostingView = defineComponent({
   props: {
        submit: Function,
        comment: String,
        file: Object,
        ipfs: Boolean,
        onCommentChange: Function,
        onFileChange: Function, 
    },

    setup(props) {
        return function render () {
            return (
                <div class="comment-posting">
                    <div class="input-container">
                        <input
                            type="text"
                            value={props.comment}
                            placeholder="Enter comment here"
                            class="thread-input"
                            onChange={props.onCommentChange}
                        />
                    </div>
                    { props.ipfs ? <input class="file-input" type="file" onChange={props.onFileChange} />: <span></span>}
                    
                    <button type="submit" onClick={props.submit}>Post</button>
                </div>
            );
        };
    },
});

export default CommentPostingView; 