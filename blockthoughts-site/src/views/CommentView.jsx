import { defineComponent } from 'vue';

const CommentView = defineComponent({
    props: {
        comment: Object,
    },

    setup(props) {
        function getImage() {
            const imgLink = "https://ipfs.io/ipfs/" + props.comment.ipfsImageCid;
            if (props.comment.ipfsImageCid != "")
                return <img src={imgLink} class="smallimg"></img>
            else
                return null;
        }

        return function render() {
            return (
                <div class="comment">
                    <div class="comment-header">
                        <span class="time">{props.comment.time}</span>
                    </div>
                    <div class="comment-content">
                        {getImage()} 
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