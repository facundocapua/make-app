import { formatPrice } from '@/utils/format'
import { useState } from 'react'
import { EditIcon, CheckIcon } from '../../Icons'

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
      <div className='flex items-center justify-between'>
        <div className='font-medium text-gray-300'>Precio</div>
        {
          showPriceInput
            ? (
              <div className='flex items-center gap-2'>
                <input
                  className="p-1 text-gray-100 bg-gray-500 rounded-lg outline-none w-[150px] focus:ring focus:ring-gray-400"
                  onChange={(e) => setNewPrice(e.target.value)}
                  type='number'
                  value={newPrice}
                  onBlur={handlePriceCancel}
                />
                <button onClick={handlePriceConfirm}>
                  <CheckIcon className='w-5 h-5 ml-1 text-gray-200' />
                </button>
              </div>
            )
            : (
              <div className='flex items-center gap-2 text-gray-200' onClick={() => setShowPriceInput(!showPriceInput)}>
                <span className='p-1 w-[150px]'>{formatPrice(price)}</span>
                <EditIcon className='w-5 h-5 ml-1 text-gray-200' />
              </div>
            )
        }
        {/* <small>(Restan: {formatPrice(price - deposit)})</small> */}
      </div>
      <div className='flex items-center justify-between'>
        <div className='font-medium text-gray-300'>Abonado</div>
        {
          showDepositInput
            ? (
              <div className='flex items-center gap-2'>
                <input
                  className="p-2 mx-2 text-gray-100 bg-gray-500 rounded-lg outline-none focus:ring focus:ring-gray-400"
                  onChange={(e) => setNewDeposit(e.target.value)}
                  type='number'
                  value={newDeposit}
                  onBlur={handleDepositCancel}
                />
                <button onClick={handleDepositConfirm}>
                  <CheckIcon className='w-5 h-5 ml-1 text-gray-400' />
                </button>
              </div>
            )
            : (
              <p className='flex items-center p-2' onClick={() => setShowDepositInput(!showDepositInput)}>
                {formatPrice(deposit)}
                <EditIcon className='w-5 h-5 ml-1 text-gray-400' />
              </p>
            )
        }
      </div>
    </>
  )
}
