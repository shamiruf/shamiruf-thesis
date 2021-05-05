import { GET_TOURS, TOURS_LOADING } from "../actions/types";

const initialState = {
  tours: [],
  loading: false,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case GET_TOURS:
      return {
        ...state,
        tours: action.payload,
        loading: false,
      };
    case TOURS_LOADING:
      return {
        ...state,
        loading: true,
      };
    default:
      return state;
  }
}
