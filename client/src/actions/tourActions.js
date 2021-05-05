import axios from "axios";
import { GET_TOURS, TOURS_LOADING } from "./types";
import { returnErrors } from "./errorActions";
// go to itemReducer and checking action.type in export def func
export const getTours = () => (dispatch) => {
  dispatch(setToursLoading());
  axios
    .get("/api/tours")
    .then((res) =>
      dispatch({
        type: GET_TOURS,
        payload: res.data,
      })
    )
    .catch((err) => {
      dispatch(returnErrors(err.response.data, err.response.status));
    });
};

export const setToursLoading = () => {
  return {
    type: TOURS_LOADING,
  };
};
