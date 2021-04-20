import { GET_ERRORS, CLEAR_ERRORS } from "../actions/types";

const initialState = {
  errorMessage: {},
  status: null,
  id: null,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case GET_ERRORS:
      return {
        errorMessage: action.payload.errorMessage,
        status: action.payload.status,
        id: action.payload.id,
      };
    case CLEAR_ERRORS:
      return {
        errorMessage: {},
        status: null,
        id: null,
      };
    default:
      return state;
  }
}
