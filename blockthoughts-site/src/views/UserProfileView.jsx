import { defineComponent, ref , watch } from 'vue';

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
    
    props.model.getUserAddressAndData();

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
          <div class="container">
          {/*<div class="image-container" onClick={this.handleImageClick}>
            <div class="profile-image-container">
              {this.isImageSelected && (
                <img
                  class="profile-image"
                  src={this.imageUrl}
                  alt="Profile Preview"
                />
              )}
              {!this.isImageSelected && (
                <div class="empty-image">Click to add image</div>
              )}
            </div>
          </div>*/}
            <label for="username">{this.username}</label>
        </div>)}
        {!this.username && (

        <div class="container">
          {/*<div class="image-container" onClick={this.handleImageClick}>
            <input
              type="file"
              id="fileInput"
              onChange={this.onFileChange}
              accept="image/*"
              style="display: none"
            />
            <div class="profile-image-container">
              {this.isImageSelected && (
                <img
                  class="profile-image"
                  src={this.imageUrl}
                  alt="Profile Preview"
                />
              )}
              {!this.isImageSelected && (
                <div class="empty-image">Click to add image</div>
              )}
            </div>
          </div>*/}
          <input type="text" id="username" v-model={this.newUsername} />
          {/* Button to submit form */}
          <button onClick={this.handleSubmit}>Submit</button>
        </div>)}
      </div>
    );
  },
});

export default UserProfileView;