import axios from "axios";
import { GET_TOURS, ADD_TOUR, DELETE_TOUR, TOURS_LOADING } from "./types";
import { tokenConfig } from "./authActions";
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

export const addTour = (tour) => (dispatch, getState) => {
  // ADD WITH WATSON ONLY

  axios
    .post("/api/tours", tour, tokenConfig(getState))
    .then((res) => dispatch({ type: ADD_TOUR, payload: res.data }))
    .catch((err) => {
      dispatch(returnErrors(err.response.data, err.response.status));
    });
};

export const deleteTour = (id) => (dispatch, getState) => {
  axios
    .delete(`/api/tours/:${id}`, tokenConfig(getState))
    .then((res) => dispatch({ type: DELETE_TOUR, payload: id }))
    .catch((err) => {
      console.log("HERE");
      dispatch(returnErrors(err.response.data, err.response.status));
    });
};

export const setToursLoading = () => {
  return {
    type: TOURS_LOADING,
  };
};
