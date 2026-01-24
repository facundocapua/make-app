import { formatPrice } from '@/utils/format'
import { useRef, useState } from 'react'
import { EditIcon, CheckIcon } from '../../Icons'

type Props = {
  price: number
  deposit: number
  onChange: (price: number, deposit: number) => void
}

export default function PrinceInfo({ price, deposit, onChange }: Props) {
  const [showPriceInput, setShowPriceInput] = useState(false)
  const [newPrice, setNewPrice] = useState(String(price))
  const [showDepositInput, setShowDepositInput] = useState(false)
  const [newDeposit, setNewDeposit] = useState(String(deposit))
  const priceRef = useRef<HTMLInputElement>(null)
  const depositRef = useRef<HTMLInputElement>(null)
  const pending = price - deposit

  const handleShowPrice = () => {
    setShowPriceInput(true)
    setTimeout(() => {
      priceRef.current?.focus()
    }, 0)
  }

  const handlePriceConfirm = () => {
    const newPriceNumber = Number(newPrice)
    if (newPriceNumber !== price) onChange(newPriceNumber, deposit)
    setShowPriceInput(false)
  }

  // const handlePriceCancel = () => {
  //   setShowPriceInput(false)
  // }

  const handleShowDeposit = () => {
    setShowDepositInput(true)
    setTimeout(() => {
      depositRef.current?.focus()
    }, 0)
  }

  const handleDepositConfirm = () => {
    const newDepositNumber = Math.min(Number(newDeposit), price)
    if (newDepositNumber !== deposit) onChange(price, newDepositNumber)

    setShowDepositInput(false)
  }

  // const handleDepositCancel = () => {
  //   setShowDepositInput(false)
  // }

  return (
    <>
      <div className='flex items-center justify-between'>
        <div className='font-medium text-gray-300'>Precio</div>
        {
          showPriceInput
            ? (
              <div className='flex items-center gap-2'>
                <input
                  className="p-1 text-gray-100 bg-gray-500 rounded-lg outline-hidden w-[150px] focus:ring-3 focus:ring-gray-400"
                  onChange={(e) => setNewPrice(e.target.value)}
                  type='number'
                  value={newPrice}
                  // onBlur={handlePriceCancel}
                  ref={priceRef}
                />
                <button onClick={handlePriceConfirm}>
                  <CheckIcon className='w-5 h-5 ml-1 text-gray-200' />
                </button>
              </div>
            )
            : (
              <div className='flex items-center gap-2 text-gray-200' onClick={handleShowPrice}>
                <span className='p-1 w-[150px]'>{formatPrice(price)}</span>
                <EditIcon className='w-5 h-5 ml-1 text-gray-200' />
              </div>
            )
        }
      </div>
      <div className='flex items-center justify-between'>
        <div className='font-medium text-gray-300'>Abonado</div>
        {
          showDepositInput
            ? (
              <div className='flex items-center gap-2'>
                <input
                  className="p-1 text-gray-100 bg-gray-500 rounded-lg outline-hidden w-[150px] focus:ring-3 focus:ring-gray-400"
                  onChange={(e) => setNewDeposit(e.target.value)}
                  type='number'
                  value={newDeposit}
                  // onBlur={handleDepositCancel}
                  ref={depositRef}
                />
                <button onClick={handleDepositConfirm}>
                  <CheckIcon className='w-5 h-5 ml-1 text-gray-400' />
                </button>
              </div>
            )
            : (
              <div className='flex items-center gap-2 text-gray-200' onClick={handleShowDeposit}>
                <span className='p-1 w-[150px]'>{formatPrice(deposit)}</span>
                <EditIcon className='w-5 h-5 ml-1 text-gray-200' />
              </div>
            )
        }
      </div>
      <div className='flex items-center justify-between'>
        <div className='font-medium text-gray-300'>Estado de pago</div>
        {
          pending === 0
            ? <div className='text-green-400'>Pagado</div>
            : <div className='text-red-400'>Pendiente: {formatPrice(pending)}</div>
        }
      </div>
    </>
  )
}
