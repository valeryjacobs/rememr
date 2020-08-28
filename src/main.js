import Vue from 'vue'
import App from './App.vue'
import store from './store'

import Buefy from 'buefy'
import 'buefy/dist/buefy.css'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faPlus,faTrash,faSave,faThumbtack} from '@fortawesome/free-solid-svg-icons'

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'





library.add(
 faPlus,faTrash,faSave,faThumbtack
)

Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.config.productionTip = false
Vue.use(Buefy)

new Vue({
  store,
  render: h => h(App)
}).$mount('#app')


