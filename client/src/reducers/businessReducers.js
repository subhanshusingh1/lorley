import { 
  BUSINESS_REGISTER_REQUEST, 
  BUSINESS_REGISTER_SUCCESS, 
  BUSINESS_REGISTER_FAIL,
  BUSINESS_LOGIN_REQUEST,
  BUSINESS_LOGIN_SUCCESS,
  BUSINESS_LOGIN_FAIL,
  BUSINESS_LOGOUT, 
  FETCH_BUSINESS_REQUEST,
  FETCH_BUSINESS_SUCCESS,
  FETCH_BUSINESS_FAILURE,
  FETCH_ALL_BUSINESSES_REQUEST,
  FETCH_ALL_BUSINESSES_SUCCESS,
  FETCH_ALL_BUSINESSES_FAILURE,
  UPDATE_BUSINESS_REQUEST,
  UPDATE_BUSINESS_SUCCESS,
  UPDATE_BUSINESS_FAILURE,
  UPLOAD_BUSINESS_PHOTO_REQUEST,
  UPLOAD_BUSINESS_PHOTO_SUCCESS,
  UPLOAD_BUSINESS_PHOTO_FAILURE,
} from '../actions/types';

// Business registration reducer
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

// Business login reducer
export const businessLogin = (state = { loading: false, businessInfo: null, error: null }, action) => {
  switch (action.type) {
    case BUSINESS_LOGIN_REQUEST:
      return { ...state, loading: true };
    
    case BUSINESS_LOGIN_SUCCESS:
      return { loading: false, businessInfo: action.payload, error: null };
    
    case BUSINESS_LOGIN_FAIL:
      return { loading: false, businessInfo: null, error: action.payload };
    
    case BUSINESS_LOGOUT:
      return { loading: false, businessInfo: null, error: null };
    
    default:
      return state;
  }
};

// Fetching single business details reducer
export const businessDetails = (state = { business: {}, loading: false }, action) => {
  switch (action.type) {
    case FETCH_BUSINESS_REQUEST:
      return { ...state, loading: true };
    
    case FETCH_BUSINESS_SUCCESS:
      return { loading: false, business: action.payload };
    
    case FETCH_BUSINESS_FAILURE:
      return { loading: false, error: action.payload };
    
    default:
      return state;
  }
};

// Fetching all businesses reducer
export const allBusinesses = (state = { businesses: [], loading: false }, action) => {
  switch (action.type) {
    case FETCH_ALL_BUSINESSES_REQUEST:
      return { ...state, loading: true };
    
    case FETCH_ALL_BUSINESSES_SUCCESS:
      return { loading: false, businesses: action.payload };
    
    case FETCH_ALL_BUSINESSES_FAILURE:
      return { loading: false, error: action.payload };
    
    default:
      return state;
  }
};

// Updating business details reducer
export const updateBusiness = (state = { business: {}, loading: false }, action) => {
  switch (action.type) {
    case UPDATE_BUSINESS_REQUEST:
      return { ...state, loading: true };
    
    case UPDATE_BUSINESS_SUCCESS:
      return { loading: false, success: true, business: action.payload };
    
    case UPDATE_BUSINESS_FAILURE:
      return { loading: false, error: action.payload };
    
    default:
      return state;
  }
};

// Uploading business photo (logo or images) reducer
export const uploadBusinessPhoto = (state = { loading: false, success: false }, action) => {
  switch (action.type) {
    case UPLOAD_BUSINESS_PHOTO_REQUEST:
      return { loading: true };
    
    case UPLOAD_BUSINESS_PHOTO_SUCCESS:
      return { loading: false, success: true, photo: action.payload };
    
    case UPLOAD_BUSINESS_PHOTO_FAILURE:
      return { loading: false, error: action.payload };
    
    default:
      return state;
  }
};
