import { defineComponent, ref } from "vue"

const ThreadPostingView = defineComponent({
    props: {
        model: Object,
    },

    setup(props) {
        const threadSubject = ref("");

        const postThread = () => {
            if (threadSubject.value.length != 0) {
                props.model.addThread(threadSubject.value);
                
                threadSubject.value = "";
            } else {
                console.error('Subject cannot be empty');
            }
        };

        return { threadSubject, postThread };
    },
    render() {
        return (
            <div>
                <div class="input-container">
                    <input
                        type="text"
                        v-model={this.threadSubject}
                        placeholder="Enter thread subject here"
                        class="input"
                    />
                    <button type="submit" onClick={this.postThread}>Post</button>
                </div>
            </div>
        );
    },
});

export default ThreadPostingView; 