import { defineComponent, ref } from "vue"
import CommentPostingView from "../views/CommentPostingView";

const CommentPoster = defineComponent({
    props: {
        model: Object,
    },


  setup(props) {
    const comment = ref('');
    const file = ref(null);

    function onPost() {
      console.log("in here!");
      if (comment.value.length !== '') {          
        props.model.addComment(comment.value, file.value);

        // Reset comment and file after posting
        comment.value = '';
        file.value = null;
      } else {
          console.error('Comment cannot be empty');
      }
    } 
    
    return function renderABC() {
        console.log(props.model.ipfs);
        return (
        <CommentPostingView
                submit={onPost}
                comment={comment.value}
                file={file.value}
                ipfs={props.model.ipfs != null}
                onCommentChange={(e) => comment.value = e.target.value}
                onFileChange={(e) => file.value = e.target.files[0]}
            />
        ) 
    }
  },
});

export default CommentPoster;