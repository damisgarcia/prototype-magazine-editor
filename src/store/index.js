import Vuex from 'vuex'

import Page from '../types/Page'

export default new Vuex.Store({
    state: {
        selectedShape: null,
        selectedPage: null,
        pages: []
    },
    actions: {
        newPage({ commit }) {
            console.log(new Page())
            commit('ADD_PAGE', new Page())
        },
        nextPage({ commit, getters, state }) {
            if (getters.currentIndexPage < state.pages.length - 1) {
                commit('SELECT_PAGE_BY_INDEX', getters.currentIndexPage  + 1)
            }
        },
        prevPage({ commit, getters }) {
            if (getters.currentIndexPage > 0) {
                commit('SELECT_PAGE_BY_INDEX', getters.currentIndexPage - 1)
            }
        },
        removePage({ commit, getters }) {
            commit('REMOVE_PAGE', getters.currentIndexPage)
        },
        updatePage({ commit, getters }, payload) {
            commit('UPDATE_PAGE', getters.currentIndexPage, payload)
        },
        selectPage({ commit }, id) {
            commit('SELECT_PAGE', id)
        },
        selectShape({ commit }, name) {
            commit('SELECT_SHAPE', name)
        }
    },
    mutations: {
        ADD_PAGE(state, page) {
            state.pages = [...state.pages, page]
            state.selectedPage = page.id
        },
        REMOVE_PAGE(state, pageIndex) {
            state.pages.slice(pageIndex, 1)
            if (this.pages.length) {
                this.selectPage = state.pages[pageIndex]?.id
            }
        },
        UPDATE_PAGE(state, pageIndex, payload) {
            state.pages[pageIndex] = payload
        },
        SELECT_PAGE_BY_INDEX(state, newIndex) {
            state.selectedPage = state.pages[newIndex]?.id
        },
        SELECT_PAGE(state, id) {
            state.selectedPage = id
        },
        SELECT_SHAPE(state, name) {
            state.selectedShape = name
        }
    },
    getters: {
        currentPage(state) {
            return state.pages.find(p => p.id === state.selectedPage)
        },
        currentIndexPage(state) {
            return state.pages.findIndex(p => p.id === state.selectedPage)
        }
    }
})