import { defineComponent, ref } from "vue"

const ThreadPostingView = defineComponent({
    props: {
        model: Object,
    },

    setup(props) {
        const newThreadContent = ref("");

        const postThread = () => {
            console.log("Posting thread:", newThreadContent.value);
            newThreadContent.value = ""; // Reset the input
        };

        return { newThreadContent, postThread };
    },
    render() {
        return (
            <div class="thread-posting">
                <form onSubmit={this.postThread}>
                    <div class="input-container">
                        <input
                            type="text"
                            v-model={this.newThreadContent}
                            placeholder="Enter thread subject here"
                            class="thread-input"
                        />
                        <button type="submit" class="post-button">Post</button>
                    </div>
                </form>
            </div>
        );
    },
});

export default ThreadPostingView; 