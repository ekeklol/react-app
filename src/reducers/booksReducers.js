"use strict";

// BOOKS REDUCERS
export function booksReducers(state={books: [
  {
    _id: 1,
    title: 'book title',
    description: 'description of this book',
    price: 11.11
  },
  {
    _id: 2,
    title: 'book title two',
    description: 'description of this book two',
    price: 22.22
  }
]}, action) {
  switch (action.type) {
    case "GET_BOOKS":
      return {...state, books:[...state.books]}
    case "POST_BOOK":
      // let books = state.books.concat(action.payload);
      return {books: [...state.books, ...action.payload]};
      break;
    case "DELETE_BOOK":
      const currentBookToDelete = [...state.books];
      const indexToDelete = currentBookToDelete.findIndex(
        function(book) {
          return book._id.toString == action.payload;
        }
      )
      return {books: [...currentBookToDelete.slice(0, indexToDelete),
      ...currentBookToDelete.slice(indexToDelete + 1)]}
      break;
    case "UPDATE_BOOK":
      const currentBookToUpdate = [...state.books];
      const indexToUpdate = currentBookToUpdate.findIndex(
        function(book) {
          return book._id === action.payload._id;
        }
      )
      const newBookToUpdate = {
        ...currentBookToUpdate[indexToUpdate],
        title: action.payload.title
      }
      console.log('what is newBookToUpdate', newBookToUpdate);
      return {books: [...currentBookToUpdate.slice(0, indexToUpdate), newBookToUpdate,
      ...currentBookToUpdate.slice(indexToUpdate + 1)]}
      break;
  }
  return state;
}
