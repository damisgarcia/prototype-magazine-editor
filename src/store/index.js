import Vuex from 'vuex'

export default new Vuex.Store({
    state: {
        selectedShape: null
    },
    actions: {
        selectShape({ commit }, name) {
            commit('SELECT_SHAPE', name)
        }
    },
    mutations: {
        SELECT_SHAPE(state, name) {
            state.selectedShape = name
        }
    }
})