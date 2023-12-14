import { defineComponent, watch, computed, ref } from 'vue';
import SimpleThreadView from '../views/SimpleThreadView.jsx';
import ThreadPostingView from '../views/ThreadPostingView.jsx';
import ThreadView from '../views/ThreadView.jsx';
import UserProfileView from '../views/UserProfileView.jsx';

const Browser = defineComponent({
    props: {
        model: Object,
    },

    setup(props) {
        props.model.getThreads();
        props.model.getClientAddressAndUpdateUserData();
        const selectedThreadId = ref(props.model.selectedThreadId);
        

        // Compute a sorted version of threads based on their time property
        const sortedThreads = computed(() => {
            return props.model.threads.slice().sort((a, b) => {
                return new Date(b.time) - new Date(a.time);
            });
        });

        return function renderACB() {
            function threadToView(thread) {
                return (
                    <SimpleThreadView
                        thread={thread}
                        onClick={() => { selectedThreadId.value = thread.id
                                         props.model.selectedThreadId = thread.id;}}
                    />
                );
            }

            return (
                <div>
                    <div style="position: fixed; top: 20px; right: 100px;">
                        <UserProfileView model={props.model} />
                    </div>

                    {selectedThreadId.value > -1 ? (
                        <ThreadView model={props.model} 
                                    thread={props.model.threads.find(thread => thread.id === selectedThreadId.value)}
                                    return={() => { selectedThreadId.value = -1
                                                    props.model.selectedThreadId = -1;
                                                    props.model.currentThreadComments = ref([]);}}
                        />
                    ) : (
                        <div class="threads-container">
                            <div>
                                <ThreadPostingView model={props.model} />
                                {sortedThreads.value.map(threadToView)}
                            </div>
                        </div>
                    )}
                </div>
            );
        };
    },
});

export default Browser;