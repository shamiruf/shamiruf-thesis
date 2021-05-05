import { combineReducers } from "redux";
import tourReducer from "./tourReducer";
import errorReducer from "./errorReducer";

export default combineReducers({
  tour: tourReducer,
  error: errorReducer,
});
