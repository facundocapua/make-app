import { formatPrice } from '@/utils/format'
import { useState } from 'react'
import { EditIcon } from '../Icons'
import CancelIcon from '../Icons/CancelIcon'
import CheckIcon from '../Icons/CheckIcon'

type Props = {
  price: number
  deposit: number
  onChange: (price:number, deposit: number) => void
}

export default function PrinceInfo ({ price, deposit, onChange }: Props) {
  const [showPriceInput, setShowPriceInput] = useState(false)
  const [newPrice, setNewPrice] = useState(String(price))
  const [showDepositInput, setShowDepositInput] = useState(false)
  const [newDeposit, setNewDeposit] = useState(String(deposit))

  const handlePriceConfirm = () => {
    const newPriceNumber = Number(newPrice)
    if (newPriceNumber !== price) onChange(newPriceNumber, deposit)

    setShowPriceInput(false)
  }

  const handlePriceCancel = () => {
    setShowPriceInput(false)
  }

  const handleDepositConfirm = () => {
    const newDepositNumber = Math.min(Number(newDeposit), price)
    if (newDepositNumber !== deposit) onChange(price, newDepositNumber)

    setShowDepositInput(false)
  }

  const handleDepositCancel = () => {
    setShowDepositInput(false)
  }

  return (
    <>
      <div className='flex items-center text-lg text-gray-100'>
        Precio:
        {/* {formatPrice(price)} */}
        {
          showPriceInput
            ? (
              <div className='relative'>
                <input
                  className="p-2 mx-2 text-gray-100 bg-gray-500 rounded-lg outline-none focus:ring focus:ring-gray-400"
                  onChange={(e) => setNewPrice(e.target.value)}
                  type='number'
                  value={newPrice}
                />
                <button className='absolute px-2 py-1 bg-gray-200 rounded right-14 bottom-1' onClick={handlePriceConfirm}>
                  <CheckIcon className='w-6 h-6 text-gray-400' />
                </button>
                <button className='absolute px-2 py-1 bg-gray-400 rounded right-3 bottom-1' onClick={handlePriceCancel}>
                  <CancelIcon className='w-6 h-6 text-gray-200' />
                </button>
              </div>
            )
            : (
              <p className='flex items-center p-2' onClick={() => setShowPriceInput(!showPriceInput)}>
                {formatPrice(price)}
                <EditIcon className='w-4 h-4 ml-1 text-gray-400' />
              </p>
            )
        }
        <small>(Restan: {formatPrice(price - deposit)})</small>
      </div>
      <div className="flex items-center my-2 text-gray-100">
        Abonado:
        {
          showDepositInput
            ? (
              <div className='relative'>
                <input
                  className="p-2 mx-2 text-gray-100 bg-gray-500 rounded-lg outline-none focus:ring focus:ring-gray-400"
                  onChange={(e) => setNewDeposit(e.target.value)}
                  type='number'
                  value={newDeposit}
                />
                <button className='absolute px-2 py-1 bg-gray-200 rounded right-14 bottom-1' onClick={handleDepositConfirm}>
                  <CheckIcon className='w-6 h-6 text-gray-400' />
                </button>
                <button className='absolute px-2 py-1 bg-gray-400 rounded right-3 bottom-1' onClick={handleDepositCancel}>
                  <CancelIcon className='w-6 h-6 text-gray-200' />
                </button>
              </div>
            )
            : (
              <p className='flex items-center p-2' onClick={() => setShowDepositInput(!showDepositInput)}>
                {formatPrice(deposit)}
                <EditIcon className='w-4 h-4 ml-1 text-gray-400' />
              </p>
            )
        }
      </div>
    </>
  )
}
