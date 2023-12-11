import { defineComponent } from "vue"
import SimpleThreadView from "../views/SimpleThreadView.jsx";

const Browser = defineComponent({
  
  props: {
    model: Object
  },

  setup(props) {
    return function renderACB() {
      function threadToView(thread) {
        return <SimpleThreadView thread={thread}/>
      }
      
      return (
        props.model.threads.map(threadToView)
      );
    };
  },
});

export default Browser;