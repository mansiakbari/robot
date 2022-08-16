import { modalActionTypes } from "../constants/modal";

export const openModal = () => {
  return { type: modalActionTypes.MODAL_OPEN };
};
export const closeModal = () => {
  return { type: modalActionTypes.MODAL_CLOSE };
};
