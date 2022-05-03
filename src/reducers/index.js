import { combineReducers } from "redux";
import { dataRefresh, isAuthenticated, fetchNonce } from "./auth.reducer";
import { fetchNetworkId, fetchWeb3Data } from "./web3.reducer";
import { fetchUser , createNFT, singeNFTDetails, unapprovedSubAdmins ,updatedNFT, createProject,adminProjects } from "./user.reducer";
import { fetchNFTList,updateProfile, registerProfile, collectionList } from "./admin.reducer";

const rootReducer = combineReducers({
  adminProjects,
  dataRefresh,
  fetchNetworkId,
  isAuthenticated,
  fetchNonce,
  fetchWeb3Data,
  fetchNFTList,
  fetchUser,
  createNFT,
  singeNFTDetails,
  updateProfile,
  registerProfile,
  unapprovedSubAdmins,
  updatedNFT,
  createProject,
  collectionList,
});

export default rootReducer;
