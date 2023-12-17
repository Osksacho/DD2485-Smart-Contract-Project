import { defineComponent } from "vue"

const SimpleThreadView = defineComponent({
    props: {
        thread: Object,
    },
    

    setup(props) {
        function getImage() {
            const imgLink = "https://ipfs.io/ipfs/" + props.thread.ipfsImageCid;
            console.log("img: ", imgLink);
            if (props.thread.ipfsImageCid != "")
                return <img src={imgLink} class="smallimg"></img>
            else
                return <span/>;
        }

        return function render() {
            return (
                <div class="thread">
                    <div class="thread-header">
                        <span class="time">{props.thread.time}</span>
                    </div>
                    <div class="thread-content">
                        {getImage()} 
                        <a>{props.thread.subject}</a>
                        <p>Poster: {props.thread.username}</p>
                    </div>
                </div>
            );
        };
    },
});

export default SimpleThreadView; 