import { defineComponent, watch, computed } from 'vue';
import SimpleThreadView from '../views/SimpleThreadView.jsx';
import ThreadPostingView from '../views/ThreadPostingView.jsx';
import UserProfileView from '../views/UserProfileView.jsx';

const Browser = defineComponent({
    props: {
        model: Object,
    },

    setup(props) {
        props.model.getThreads();
        props.model.getClientAddressAndUpdateUserData();
        
        watch(() => props.model.threads, () => {});
        watch(() => props.model.userData, () => {});

        // Compute a sorted version of threads based on their time property
        const sortedThreads = computed(() => {
            return props.model.threads.slice().sort((a, b) => {
                return new Date(b.time) - new Date(a.time);
            });
        });

        return function renderACB() {
            function threadToView(thread) {
                return <SimpleThreadView thread={thread} />;
            }

            return (
                <div>
                    <div style="position: fixed; top: 20px; right: 100px;">
                        <UserProfileView model={props.model} />
                    </div>

                    <div class="threads-container">
                        <div>
                            <ThreadPostingView model={props.model} />
                            {sortedThreads.value.map(threadToView)}
                        </div>
                    </div>
                </div>
            );
        };
    },
});

export default Browser;