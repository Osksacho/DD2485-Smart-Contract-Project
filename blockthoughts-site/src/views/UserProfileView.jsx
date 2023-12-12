import { defineComponent, ref , watch } from 'vue';

const UserProfileView = defineComponent({
  props: {
    model: Object,
  },

  setup(props) {
    const username = ref(props.model.userData.username);
    const newUsername = ref('');

    const imageFile = ref(null);
    const imageUrl = ref('');
    const isImageSelected = ref(false);

    const onFileChange = event => {
      imageFile.value = event.target.files[0];
      previewImage();
    };

    const previewImage = () => {
      const reader = new FileReader();
      reader.readAsDataURL(imageFile.value);
      reader.onload = e => {
        imageUrl.value = e.target.result;
        isImageSelected.value = true;
      };
    };

    const handleImageClick = () => {
      const fileInput = document.getElementById('fileInput');
      if (fileInput) {
        fileInput.click();
      }
    };

    const handleSubmit = () => {
      if (newUsername.value && imageFile.value) {
        props.model.submitUserData(newUsername.value, imageFile.value);

        // Update the key to force re-render
        props.model.key += 1;
      } else {
        console.error('No file selected');
      }
    };

    // Watch for changes in the entire model object
    watch(() => props.model, () => {
        // Update username and trigger reactivity
        username.value = props.model.userData.username;
      }, { deep: true });

    return {
      username,
      newUsername,
      onFileChange,
      imageUrl,
      isImageSelected,
      handleImageClick,
      handleSubmit,
    };
  },

  // Render function
  render() {
    const userDataExists = this.username != null;

    return (
      <div>
        <h2>User data</h2>
        {userDataExists && (
          <div class="container">
          <div class="image-container" onClick={this.handleImageClick}>
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
          </div>
          <label for="username">{this.username}</label>
        </div>)}
        {!userDataExists && (

        <div class="container">
          <div class="image-container" onClick={this.handleImageClick}>
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
          </div>
          <label for="username">Username:</label>
          <input type="text" id="username" v-model={this.newUsername} />
          {/* Button to submit form */}
          <button onClick={this.handleSubmit}>Submit</button>
        </div>)}
      </div>
    );
  },
});

export default UserProfileView;