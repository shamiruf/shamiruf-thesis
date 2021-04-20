import { combineReducers } from "redux";
import tourReducer from "./tourReducer";
import errorReducer from "./errorReducer";
import authReducer from "./authReducer";

export default combineReducers({
  tour: tourReducer,
  error: errorReducer,
  auth: authReducer,
});
