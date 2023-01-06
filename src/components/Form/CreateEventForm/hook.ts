import { EventType } from '@/types/event'
import { useReducer } from 'react'

const ACTIONS_TYPES = {
  UPDATE_FULL_NAME: 'update_full_name',
  UPDATE_DATE: 'update_date',
  UPDATE_DURATION: 'update_duration',
  UPDATE_INCLUDES_TEST: 'update_includes_test',
  UPDATE_TEST_DATE: 'update_test_date',
  UPDATE_PRICE: 'update_price',
  UPDATE_DEPOSIT: 'update_deposit'
}

type ActionType<T> = {
  type: keyof typeof ACTIONS_TYPES,
  payload: T
}

const ACTIONS = {
  [ACTIONS_TYPES.UPDATE_FULL_NAME]: (state: Omit<EventType, 'id'>, action: ActionType<EventType['id']>): Omit<EventType, 'id'> => {
    return { ...state, fullName: action.payload }
  },
  [ACTIONS_TYPES.UPDATE_DATE]: (state: Omit<EventType, 'id'>, action: ActionType<EventType['date']>): Omit<EventType, 'id'> => {
    return { ...state, date: action.payload }
  },
  [ACTIONS_TYPES.UPDATE_DURATION]: (state: Omit<EventType, 'id'>, action: ActionType<EventType['duration']>): Omit<EventType, 'id'> => {
    return { ...state, duration: action.payload }
  },
  [ACTIONS_TYPES.UPDATE_INCLUDES_TEST]: (state: Omit<EventType, 'id'>, action: ActionType<EventType['includesTest']>): Omit<EventType, 'id'> => {
    return { ...state, includesTest: action.payload }
  },
  [ACTIONS_TYPES.UPDATE_TEST_DATE]: (state: Omit<EventType, 'id'>, action: ActionType<EventType['testDate']>): Omit<EventType, 'id'> => {
    return { ...state, testDate: action.payload }
  },
  [ACTIONS_TYPES.UPDATE_PRICE]: (state: Omit<EventType, 'id'>, action: ActionType<EventType['price']>): Omit<EventType, 'id'> => {
    return { ...state, price: action.payload }
  },
  [ACTIONS_TYPES.UPDATE_DEPOSIT]: (state: Omit<EventType, 'id'>, action: ActionType<EventType['deposit']>): Omit<EventType, 'id'> => {
    return { ...state, deposit: action.payload }
  }
}

const reducer = (state: Omit<EventType, 'id'>, action: any) => {
  const actionToExecute = ACTIONS[action.type]
  return actionToExecute ? actionToExecute(state, action) : state
}

type UseFormResponse = Omit<EventType, 'id'> & {
  updateFullname: (fullName: string) => void,
  updateDate: (date: string) => void,
  updateDuration: (duration: number) => void,
  updateIncludesTest: (includesTest: boolean) => void,
  updateTestDate: (testDate: string) => void,
  updatePrice: (price: string) => void,
  updateDeposit: (deposit: string) => void
}

export default function useForm (): UseFormResponse {
  const [state, dispatch] = useReducer(reducer, {
    fullName: '',
    date: new Date().toISOString(),
    includesTest: false,
    testDate: '',
    duration: 60,
    price: parseInt(process.env.NEXT_PUBLIC_DEFAULT_PRICE ?? ''),
    deposit: parseInt(process.env.NEXT_PUBLIC_DEFAULT_PRICE ?? '') / 2
  })

  return {
    ...state,
    updateFullname: (fullName: string) => dispatch({ type: ACTIONS_TYPES.UPDATE_FULL_NAME, payload: fullName }),
    updateDate: (date: string) => dispatch({ type: ACTIONS_TYPES.UPDATE_DATE, payload: date }),
    updateDuration: (duration: number) => dispatch({ type: ACTIONS_TYPES.UPDATE_DURATION, payload: duration }),
    updateIncludesTest: (includesTest: boolean) => dispatch({ type: ACTIONS_TYPES.UPDATE_INCLUDES_TEST, payload: includesTest }),
    updateTestDate: (testDate: string) => dispatch({ type: ACTIONS_TYPES.UPDATE_TEST_DATE, payload: testDate }),
    updatePrice: (price: string) => dispatch({ type: ACTIONS_TYPES.UPDATE_PRICE, payload: price }),
    updateDeposit: (deposit: string) => dispatch({ type: ACTIONS_TYPES.UPDATE_DEPOSIT, payload: deposit })
  }
}
