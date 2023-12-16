import { defineComponent } from "vue"

const ThreadPostingView = defineComponent({
    props: {
        submit: Function,
        subject: String,
        file: Object,
        ipfs: Boolean,
        onSubjectChange: Function,
        onFileChange: Function, 
    },

    setup(props) {
        return function render () {
            return (
                <div class="thread-posting">
                    <div class="input-container">
                        <input
                            type="text"
                            value={props.subject}
                            placeholder="Enter thread subject here"
                            class="thread-input"
                            onChange={props.onSubjectChange}
                        />
                    </div>
                    { props.ipfs ? <input class="file-input" type="file" onChange={props.onFileChange} />: <span></span>}
                    
                    <button type="submit" onClick={props.submit}>Post</button>
                </div>
            );
        };
    },
});

export default ThreadPostingView; 