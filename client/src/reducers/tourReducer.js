import {
  GET_TOURS,
  ADD_TOUR,
  DELETE_TOUR,
  TOURS_LOADING,
} from "../actions/types";

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
    case DELETE_TOUR:
      return {
        ...state,
        tours: state.tours.filter((tour) => tour._id !== action.payload),
      };
    case ADD_TOUR:
      return {
        ...state,
        tours: [action.payload, ...state.tours],
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
