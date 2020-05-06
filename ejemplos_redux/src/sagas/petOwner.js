import {
    call,
    takeEvery,
    put,
    // race,
    // all,
    delay,
    select,
} from 'redux-saga/effects';
import { v4 as uuid } from 'uuid'


import * as selectors from '../reducers';
import * as actions from '../actions/petOwners';
import * as types from '../types/petOwners';


const API_BASE_URL = 'http://localhost:8000/api/v1';

function* fetchPetOwners(actions) {
    try {
        const isAuth = yield select(selectors.isAuthenticated);

        if(isAuth){
            const token = yield select(selectors.isAuthenticated);

            const response = yield call (
                fetch,
                `${API_BASE_URL}/owners/`, 
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `JWT ${token}`,
                    },
                }
            );

            if(response.status === 200) {
                let entities = {};
                let order = [];

                const info = yield response.json();

                info.forEach( owner => {
                    const id = uuid();
                    entities = {...entities, [id]: owner,}
                    order = [...order, id]
                });

                yield put(actions.completedFetchingPetOwners(entities, order));
            }
        }

    } catch(error) {
        yield put(actions.failedFetchdingOwner('Ha sucedido un error!'));
    }
}

function* addPetOwner(action) {
    try{
        const isAuth = yield select(selectors.isAuthenticated);

        if(isAuth){
            const token = yield select(selectors.isAuthenticated);

            const response = yield call (
                fetch,
                `${API_BASE_URL}/owners/`, 
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `JWT ${token}`,
                    },
                }
            );

            if(response.status === 201) {
                yield put(actions.completedAddingPetOwner(action.payload.id, action.payload));
            } else {
                const { non_field_errors } = yield response.json();
                yield put(actions.failedAddingOwner(action.payload.id, non_field_errors[0]));
            }
        
        }

    } catch (error) {
        console.log(error);
        yield put(actions.failedAddingOwner(action.payload.id, 'Ha sucedido un error!'))
    }
}

function* removePetOwner(action) {
    try{
        const isAuth = yield select(selectors.isAuthenticated);

        if(isAuth){
            const token = yield select(selectors.isAuthenticated);

            const response = yield call (
                fetch,
                `${API_BASE_URL}/owners/`, 
                {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `JWT ${token}`,
                    },
                }
            );

            if(response.status === 204) {
                yield put(actions.completedRemovingPetOwner());
            } else {
                const { non_field_errors } = yield response.json();
                yield put(actions.failedAddingOwner(action.payload.id, non_field_errors[0]));
            }
        
        }

    } catch (error) {
        console.log(error);
        yield put(actions.failedAddingOwner(action.payload.id, 'Ha sucedido un error!'));
    }
}

export function* watchFetchPetOwners() {
    yield takeEvery(
        types.PET_OWNERS_FETCH_STARTED,
        fetchPetOwners,
    );
}

export function* watchAddPetOwner() {
    yield takeEvery(
        types.PET_OWNER_ADD_STARTED,
        addPetOwner,
    );
}

export function* watchRemovePetOwner() {
    yield takeEvery(
        types.PET_OWNER_REMOVE_STARTED,
        removePetOwner,
    );
}