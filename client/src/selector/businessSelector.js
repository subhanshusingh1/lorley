
// Selector for business login information
export const selectBusinessInfo = (state) => state.businessLogin.businessInfo;

// Selector for business registration information
export const selectBusinessRegistration = (state) => state.businessRegister.businessInfo;

// Selector for fetching business details
export const selectBusinessDetails = (state) => state.businessDetails.business;

// Selector for updating business information
export const selectUpdatedBusiness = (state) => state.updateBusiness.business;
