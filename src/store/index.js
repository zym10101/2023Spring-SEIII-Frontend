// import {createStore} from "vuex";

// export default createStore({
//     state: {},
//     getters: {},
//     mutations: {},
//     actions: {},
//     modules: {},
// });

// store.js

import Vuex from 'vuex';


const store = new Vuex.Store({
    state: {
        token: null,
        username: null
    },
    mutations: {
        setToken(state, token) {
            state.token = token;
        },
        setUsername(state, username) {
            state.username = username;
        },
        clearLoginInfo(state) {
            state.token = null;
            state.username = null;
        }
    },
    actions: {
        loginSuccess({ commit }, { token, username }) {
            commit('setToken', token);
            commit('setUsername', username);
        },
        logout({ commit }) {
            commit('clearLoginInfo');
        }
    }
});

export default store;
