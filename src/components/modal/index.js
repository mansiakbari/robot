import { Button, Modal } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import { closeModal } from "../../redux/actions/modal";
import React from "react";
import { useHistory } from "react-router-dom";

const PopupModal = (props) => {
  const dispatch = useDispatch();
  const history = useHistory()
  const modal = useSelector((state) => state.modal);
  const { title = "", children, onOk, cancelText, okText, isFooter = true } = props;
  return (
    <>
      <Modal open={modal} className="modal">
        <div className="modal-container outline-none">
        {title && <div className="modal-header">{title}</div>}
          <div className="modal-body">
            <div>{children}</div>
            {isFooter && <div className="modal-footer">
              <Button variant="contained" onClick={onOk} color="primary">
                {okText}
              </Button>
              {cancelText && (
                <Button
                  style={{ marginLeft: "10px" }}
                  variant="outlined"
                  color="secondary"
                  onClick={() => {
                    history.push("/")
                    dispatch(closeModal());
                  }}
                >
                  {cancelText}
                </Button>
              )}
            </div>}
          </div>
        </div>
      </Modal>
    </>
  );
};

export default PopupModal;
