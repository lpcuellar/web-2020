import { 
  fork, 
  all, 
} from 'redux-saga/effects';

import { watchLoginStarted } from './auth';
import { watchSayHappyBirthday } from './happyBirthday';
import {
  watchFetchPetOwners,
  watchAddPetOwner,
  watchRemovePetOwner,
} from './petOwner';


function* mainSaga() {
  yield all([
    fork(watchLoginStarted),
    fork(watchSayHappyBirthday),
    fork(watchFetchPetOwners),
    fork(watchAddPetOwner),
    fork(watchRemovePetOwner),
  ]);
}


export default mainSaga;
