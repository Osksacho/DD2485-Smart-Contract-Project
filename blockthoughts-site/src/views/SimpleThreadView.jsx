import { defineComponent } from "vue"

const SimpleThreadView = defineComponent({
    props: {
        thread: Object,
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