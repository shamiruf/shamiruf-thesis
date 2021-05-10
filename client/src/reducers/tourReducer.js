import { GET_TOURS } from "../actions/types";

const initialState = {
  tours: [],
};

export default function (state = initialState, action) {
  switch (action.type) {
    case GET_TOURS:
      return {
        ...state,
        tours: action.payload,
      };
    default:
      return state;
  }
}
