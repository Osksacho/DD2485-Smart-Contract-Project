import { defineComponent, ref } from "vue"
import ThreadPostingView from "../views/ThreadPostingView";

const ThreadPoster = defineComponent({
    props: {
        model: Object,
    },


   setup(props) {
       const subject = ref('');
        const file = ref(null);

        function onPost() {
            console.log("in here!");
            if (subject.value.length !== '') {
                props.model.addThread(subject.value, file.value);

                // Reset subject and file after posting
                subject.value = '';
                file.value = null;
            } else {
                console.error('Subject cannot be empty');
            }
        } 
       
        return function renderABC() {
            console.log(props.model.ipfs);
            return (
            <ThreadPostingView
                    submit={onPost}
                    subject={subject.value}
                    file={file.value}
                    ipfs={props.model.ipfs != null}
                    onSubjectChange={(e) => subject.value = e.target.value}
                    onFileChange={(e) => file.value = e.target.files[0]}
                />
            ) 
        }
    },
});

export default ThreadPoster;