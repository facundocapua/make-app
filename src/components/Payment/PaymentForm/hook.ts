import type { PaymentType } from '@/types/payment'
import { SERVICES, PAYMENT_METHODS } from '@/types/payment'
import type { Reducer } from 'react'
import { useReducer } from 'react'

const ACTIONS_TYPES = {
  UPDATE_DATE: 'update_date',
  UPDATE_PAYMENT_METHOD: 'update_payment_method',
  UPDATE_DESCRIPTION: 'update_description',
  UPDATE_SERVICE: 'update_service',
  UPDATE_AMOUNT: 'update_price',
  UPDATE_CLIENT_ID: 'update_client_id',
  RESET: 'reset'
}

const defaultState = {
  date: new Date().toISOString(),
  paymentMethod: PAYMENT_METHODS[0],
  description: '',
  service: SERVICES[0],
  amount: 0,
  clientId: ''
}

type ActionType<T> = {
  type: keyof typeof ACTIONS_TYPES,
  payload: T
}

const ACTIONS = {
  [ACTIONS_TYPES.UPDATE_DATE]: (state: PaymentType, action: ActionType<PaymentType['date']>): PaymentType => {
    return { ...state, date: action.payload }
  },
  [ACTIONS_TYPES.UPDATE_PAYMENT_METHOD]: (state: PaymentType, action: ActionType<PaymentType['paymentMethod']>): PaymentType => {
    return { ...state, paymentMethod: action.payload }
  },
  [ACTIONS_TYPES.UPDATE_DESCRIPTION]: (state: PaymentType, action: ActionType<PaymentType['description']>): PaymentType => {
    return { ...state, description: action.payload }
  },
  [ACTIONS_TYPES.UPDATE_SERVICE]: (state: PaymentType, action: ActionType<PaymentType['service']>): PaymentType => {
    return { ...state, service: action.payload }
  },
  [ACTIONS_TYPES.UPDATE_AMOUNT]: (state: PaymentType, action: ActionType<PaymentType['amount']>): PaymentType => {
    return { ...state, amount: action.payload }
  },
  [ACTIONS_TYPES.UPDATE_CLIENT_ID]: (state: PaymentType, action: ActionType<PaymentType['clientId']>): PaymentType => {
    return { ...state, clientId: action.payload }
  },
  [ACTIONS_TYPES.RESET]: (): PaymentType => {
    return { ...defaultState }
  }
}

const reducer = (state: PaymentType, action: any) => {
  const actionToExecute = ACTIONS[action.type]
  return actionToExecute ? actionToExecute(state, action) : state
}

type UseFormResponse = PaymentType & {
  updateDate: (date: PaymentType['date']) => void
  updatePaymentMethod: (paymentMethod: PaymentType['paymentMethod']) => void
  updateDescription: (description: PaymentType['description']) => void
  updateService: (service: PaymentType['service']) => void
  updateAmount: (price: PaymentType['amount']) => void
  updateClientId: (clientId: PaymentType['clientId']) => void
  reset: () => void
}

export default function useForm (): UseFormResponse {
  const [state, dispatch] = useReducer<Reducer<PaymentType, any>>(reducer, defaultState)

  return {
    ...state,
    updateDate: (date: PaymentType['date']) => dispatch({ type: ACTIONS_TYPES.UPDATE_DATE, payload: date }),
    updatePaymentMethod: (paymentMethod: PaymentType['paymentMethod']) => dispatch({ type: ACTIONS_TYPES.UPDATE_PAYMENT_METHOD, payload: paymentMethod }),
    updateDescription: (description: PaymentType['description']) => dispatch({ type: ACTIONS_TYPES.UPDATE_DESCRIPTION, payload: description }),
    updateService: (service: PaymentType['service']) => dispatch({ type: ACTIONS_TYPES.UPDATE_SERVICE, payload: service }),
    updateAmount: (amount: PaymentType['amount']) => dispatch({ type: ACTIONS_TYPES.UPDATE_AMOUNT, payload: amount }),
    updateClientId: (clientId: PaymentType['clientId']) => dispatch({ type: ACTIONS_TYPES.UPDATE_CLIENT_ID, payload: clientId }),
    reset: () => dispatch({ type: ACTIONS_TYPES.RESET, payload: null })
  }
}
