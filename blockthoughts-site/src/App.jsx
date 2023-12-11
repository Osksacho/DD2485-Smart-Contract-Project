import { defineComponent, reactive } from 'vue';
import { RouterView } from 'vue-router';
import Model from './model.js';

const App = defineComponent({
  setup() {
    const topModel = reactive(new Model([]));

    return function render() {
      return (
        <div class="container">          
          <RouterView model={topModel} />
        </div>
      )
    }
  }
})

export default App;
