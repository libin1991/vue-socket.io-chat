import Vue from 'vue'
import * as types from './mutation-types'

export default {
  [types.RECEIVE_ALL] (state, { messages }) {
    let latestMessage
    messages.forEach(message => {
      // create new thread if the thread doesn't exist
      if (!state.threads[message.threadID]) {
        createThread(state, message.threadID, message.threadName)
      }
      // mark the latest message
      if (!latestMessage || message.timestamp > latestMessage.timestamp) {
        latestMessage = message
      }
      // add message
      addMessage(state, message)
    })
    // set initial thread to the one with the latest message
    setCurrentThread(state, latestMessage.threadID)
  },

  [types.RECEIVE_MESSAGE] (state, { message }) {
    addMessage(state, message)
  },

  [types.SWITCH_THREAD] (state, { id }) {
    setCurrentThread(state, id)
  },

  [types.ADD_USERNUMBER] (state) {
    addUserNumber(state)
  },

  [types.UPDATE_USERNUMBER] (state, { count }) {
    updateUserNumber(state, count)
  },

  [types.UPDATE_USERNAMELIST] (state, { userNameList }) {
    updateUserNameList(state, userNameList)
  }
}

function createThread (state, id, name) {
  Vue.set(state.threads, id, {
    id,
    name,
    messages: [],
    lastMessage: null
  })
}

function addMessage (state, message) {
  // add a `isRead` field before adding the message
  message.isRead = message.threadID === state.currentThreadID
  // add it to the thread it belongs to
  const thread = state.threads[message.threadID]
  if (!thread.messages.some(id => id === message.id)) {
    thread.messages.push(message.id)
    thread.lastMessage = message
  }
  // add it to the messages map
  Vue.set(state.messages, message.id, message)
}

function setCurrentThread (state, id) {
  state.currentThreadID = id
  if (!state.threads[id]) {
    debugger
  }
  // mark thread as read
  state.threads[id].lastMessage.isRead = true
}

function addUserNumber (state) {
  state.userCount++
}

function updateUserNumber (state, count) {
  state.userCount = count
}

function updateUserNameList (state, userNameList) {
  state.userNameList = userNameList
}