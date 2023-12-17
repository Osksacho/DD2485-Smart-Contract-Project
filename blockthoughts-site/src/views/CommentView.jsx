import { defineComponent } from 'vue';

const CommentView = defineComponent({
    props: {
        comment: Object,
    },

    setup(props) {
        function getImage() {
            const imgLink = "https://ipfs.io/ipfs/" + props.comment.ipfsImageCid;
            console.log("Comment imagelink: ", imgLink);
            if (props.comment.ipfsImageCid != "")
                return <img src={imgLink} class="smallimg"></img>
            else
                return <span/>;
        }

        return function render() {
            console.log(props.comment);
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