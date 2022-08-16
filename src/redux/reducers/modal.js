import { modalActionTypes } from "../constants/modal";

const initState = {
  isModalOpen: false,
};

const modal = (state = initState, action) => {
  switch (action.type) {
    case modalActionTypes.MODAL_OPEN:
      return {
        ...state,
        isModalOpen: true,
      };
    case modalActionTypes.MODAL_CLOSE:
      return {
        ...state,
        isModalOpen: false,
      };
    default:
      return state;
  }
};

export default modal;
