import axios from "axios";
import { GET_TOURS } from "./types";

export const getTours = () => (dispatch) => {
  axios
    .get("/api/tours")
    .then((res) =>
      dispatch({
        type: GET_TOURS,
        payload: res.data,
      })
    )
    .catch((err) => {
      console.log(err);
    });
};
