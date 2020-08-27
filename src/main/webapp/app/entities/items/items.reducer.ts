import axios from 'axios';
import {
  parseHeaderForLinks,
  loadMoreDataWhenScrolled,
  ICrudGetAction,
  ICrudGetAllAction,
  ICrudPutAction,
  ICrudDeleteAction,
} from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { IItems, defaultValue } from 'app/shared/model/items.model';

export const ACTION_TYPES = {
  FETCH_ITEMS_LIST: 'items/FETCH_ITEMS_LIST',
  FETCH_ITEMS: 'items/FETCH_ITEMS',
  CREATE_ITEMS: 'items/CREATE_ITEMS',
  UPDATE_ITEMS: 'items/UPDATE_ITEMS',
  DELETE_ITEMS: 'items/DELETE_ITEMS',
  RESET: 'items/RESET',
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IItems>,
  entity: defaultValue,
  links: { next: 0 },
  updating: false,
  totalItems: 0,
  updateSuccess: false,
};

export type ItemsState = Readonly<typeof initialState>;

// Reducer

export default (state: ItemsState = initialState, action): ItemsState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_ITEMS_LIST):
    case REQUEST(ACTION_TYPES.FETCH_ITEMS):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true,
      };
    case REQUEST(ACTION_TYPES.CREATE_ITEMS):
    case REQUEST(ACTION_TYPES.UPDATE_ITEMS):
    case REQUEST(ACTION_TYPES.DELETE_ITEMS):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true,
      };
    case FAILURE(ACTION_TYPES.FETCH_ITEMS_LIST):
    case FAILURE(ACTION_TYPES.FETCH_ITEMS):
    case FAILURE(ACTION_TYPES.CREATE_ITEMS):
    case FAILURE(ACTION_TYPES.UPDATE_ITEMS):
    case FAILURE(ACTION_TYPES.DELETE_ITEMS):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload,
      };
    case SUCCESS(ACTION_TYPES.FETCH_ITEMS_LIST): {
      const links = parseHeaderForLinks(action.payload.headers.link);

      return {
        ...state,
        loading: false,
        links,
        entities: loadMoreDataWhenScrolled(state.entities, action.payload.data, links),
        totalItems: parseInt(action.payload.headers['x-total-count'], 10),
      };
    }
    case SUCCESS(ACTION_TYPES.FETCH_ITEMS):
      return {
        ...state,
        loading: false,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.CREATE_ITEMS):
    case SUCCESS(ACTION_TYPES.UPDATE_ITEMS):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.DELETE_ITEMS):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: {},
      };
    case ACTION_TYPES.RESET:
      return {
        ...initialState,
      };
    default:
      return state;
  }
};

const apiUrl = 'api/items';

// Actions

export const getEntities: ICrudGetAllAction<IItems> = (page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_ITEMS_LIST,
    payload: axios.get<IItems>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`),
  };
};

export const getEntity: ICrudGetAction<IItems> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_ITEMS,
    payload: axios.get<IItems>(requestUrl),
  };
};

export const createEntity: ICrudPutAction<IItems> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_ITEMS,
    payload: axios.post(apiUrl, cleanEntity(entity)),
  });
  return result;
};

export const updateEntity: ICrudPutAction<IItems> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_ITEMS,
    payload: axios.put(apiUrl, cleanEntity(entity)),
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<IItems> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_ITEMS,
    payload: axios.delete(requestUrl),
  });
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET,
});
