import { 
    BUSINESS_REGISTER_REQUEST, 
    BUSINESS_REGISTER_SUCCESS, 
    BUSINESS_REGISTER_FAIL,
    BUSINESS_LOGIN_REQUEST,
    BUSINESS_LOGIN_SUCCESS,
    BUSINESS_LOGIN_FAIL,
    BUSINESS_LOGOUT, 
} from '../actions/types';

// Business registration
export const businessRegister = (state = {}, action) => {
    switch (action.type) {
        case BUSINESS_REGISTER_REQUEST:
            return { loading: true };
        
        case BUSINESS_REGISTER_SUCCESS:
            return { loading: false, businessInfo: action.payload };

        case BUSINESS_REGISTER_FAIL:
            return { loading: false, error: action.payload };

        default:
            return state;
    }
};

// Business login
export const businessLogin = (state = {}, action) => {
    switch (action.type) {
      case BUSINESS_LOGIN_REQUEST:
        return { loading: true };
      case BUSINESS_LOGIN_SUCCESS:
        return { loading: false, businessInfo: action.payload };
      case BUSINESS_LOGIN_FAIL:
        return { loading: false, error: action.payload };
      case BUSINESS_LOGOUT:
        return {};
      default:
        return state;
    }
  };
