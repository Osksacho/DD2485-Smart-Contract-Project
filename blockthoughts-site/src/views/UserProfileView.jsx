import { defineComponent, ref, watch } from 'vue';

const UserProfileView = defineComponent({
    props: {
        model: Object,
    },

    setup(props) {

        const username = ref(props.model.userData.username);
        const newUsername = ref('');

        const handleSubmit = () => {
            if (newUsername.value.length != 0) {
                props.model.submitUserData(newUsername.value);
            } else {
                console.error('Username cannot be empty');
            }
        };

        // Watch for changes in the entire model object
        watch(() => props.model.userData.username, () => {
            // Update username and trigger reactivity
            username.value = props.model.userData.username;
        }, { deep: true });


        return {
            username,
            newUsername,
            handleSubmit,
        };
    },


    // Render function
    render() {
        return (
            <div>
                <h2>Username</h2>
                {this.username && (
                    <div class="userdata-container">
                        <label for="username">{this.username}</label>
                    </div>)}
                {!this.username && (
                    <div class="userdata-container">
                        <input type="text" id="username" v-model={this.newUsername} />
                        <button onClick={this.handleSubmit}>Submit</button>
                    </div>)}
            </div>
        );
    },
});

export default UserProfileView;