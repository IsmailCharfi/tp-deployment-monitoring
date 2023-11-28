import Vue from "vue";
import Vuex from "vuex";
import Toastify from "toastify-js";

Vue.use(Vuex);

const toast = (text, error = false) => {
  Toastify({
    text,
    duration: 1500,
    style: {
      background: error
        ? "linear-gradient(to right, #ff0000, #c70039)"
        : "linear-gradient(to right, #00b09b, #4cff8a)",
    },
  }).showToast();
};

const fetchAll = async (API_PATH) => {
  const response = await fetch(`${API_PATH}/todos`);

  if (response.ok) {
    return await response.json();
  } else {
    return [];
  }
};

const addTodo = async (API_PATH, todo) => {
  const response = await fetch(`${API_PATH}/todos`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(todo),
  });

  if (response.ok) {
    const { message } = await response.json();
    toast(message);
    return true;
  } else {
    toast("Error", true);
  }
};

const updateTodo = async (API_PATH, todo) => {
  const response = await fetch(`${API_PATH}/todos/${todo.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(todo),
  });

  if (response.ok) {
    const { message } = await response.json();
    toast(message);
    return true;
  } else {
    toast("Error", true);
  }
};

const deleteTodo = async (API_PATH, id) => {
  const response = await fetch(`${API_PATH}/todos/${id}`, { method: "DELETE" });

  if (response.ok) {
    const { message } = await response.json();
    toast(message);
    return true;
  } else {
    toast("Error", true);
  }
};

export const todoStore = new Vuex.Store({
  state: {
    items: [],
    API_PATH: "http://localhost:5050",
  },
  getters: {
    items: (state) => {
      return state.items;
    },
    completedItems: (state) => {
      return state.items.filter((item) => item.completed);
    },
    totalItems: (state) => {
      return state.items.length;
    },
    totalCompletedItems: (state, getters) => {
      return getters.completedItems.length;
    },
  },
  mutations: {
    setApiPath: async (state) => {
      const response = await fetch("/api");
      if (response.ok) {
        const data = await response.json();
        state.API_PATH = data.api;
      }
    },
    setItems: async (state) => {
      state.items = await fetchAll(state.API_PATH);
    },
    addItem: async (state, payload) => {
      if (await addTodo(state.API_PATH, payload)) {
        state.items = await fetchAll(state.API_PATH);
      }
    },
    updateItem: async (state, payload) => {
      if (await updateTodo(state.API_PATH, payload)) {
        state.items = await fetchAll(state.API_PATH);
      }
    },
    deleteItem: async (state, payload) => {
      if (await deleteTodo(state.API_PATH, payload)) {
        state.items = await fetchAll(state.API_PATH);
      }
    },
  },
});
