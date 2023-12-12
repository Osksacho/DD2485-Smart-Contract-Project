import { defineComponent } from 'vue';
import SimpleThreadView from '../views/SimpleThreadView.jsx';
import UserProfileView from '../views/UserProfileView.jsx';

const Browser = defineComponent({
  props: {
    model: Object,
  },

  setup(props) {
    return function renderACB() {
      function threadToView(thread) {
        return <SimpleThreadView thread={thread}/>
      }
      
      return (
        <div>
          <div style="position: fixed; top: 20px; right: 20px;">
            <UserProfileView model={props.model}/>
          </div>

          <div>
            {props.model.threads.map(threadToView)}
          </div>
        </div>
      );
    };
},
});


export default Browser;