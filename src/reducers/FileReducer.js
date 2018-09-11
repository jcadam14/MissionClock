import { TOGGLE_MODAL} from "../constants/action-types";

const initialState = {
    modal:false
};

const fileReducer = (state = initialState, action) => {
    switch (action.type) {
        case TOGGLE_MODAL:
            return {modal:!state.modal};
        default:
            return state;
    }
};

export default fileReducer;