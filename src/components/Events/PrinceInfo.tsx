import { formatPrice } from '@/utils/format'
import { useState } from 'react'
import { EditIcon } from '../Icons'
import CancelIcon from '../Icons/CancelIcon'
import CheckIcon from '../Icons/CheckIcon'

type Props = {
  price: number
  deposit: number
  onChange: (deposit: number) => void
}

export default function PrinceInfo ({ price, deposit, onChange }: Props) {
  const [showInput, setShowInput] = useState(false)
  const [newDeposit, setNewDeposit] = useState(String(deposit))

  const handleConfirm = () => {
    const newDepositNumber = Math.min(Number(newDeposit), price)
    if (newDepositNumber !== deposit) onChange(newDepositNumber)

    setShowInput(false)
  }

  const handleCancel = () => {
    setShowInput(false)
  }

  return (
    <>
      <p className='text-lg text-gray-100'>Precio: {formatPrice(price)} <small>(Restan: {formatPrice(price - deposit)})</small></p>
      <div className="flex items-center my-2 text-gray-100">
        Abonado:
        {
          showInput
            ? (
              <div className='relative'>
                <input
                  className="p-2 mx-2 text-gray-100 bg-gray-500 rounded-lg outline-none focus:ring focus:ring-gray-400"
                  onChange={(e) => setNewDeposit(e.target.value)}
                  type='number'
                  value={newDeposit}
                />
                <button className='absolute px-2 py-1 bg-gray-200 rounded right-14 bottom-1' onClick={handleConfirm}>
                  <CheckIcon className='w-6 h-6 text-gray-400' />
                </button>
                <button className='absolute px-2 py-1 bg-gray-400 rounded right-3 bottom-1' onClick={handleCancel}>
                  <CancelIcon className='w-6 h-6 text-gray-200' />
                </button>
              </div>
            )
            : (
              <p className='flex items-center p-2' onClick={() => setShowInput(!showInput)}>
                {formatPrice(deposit)}
                <EditIcon className='w-4 h-4 ml-1 text-gray-400' />
              </p>
            )
        }
      </div>
    </>
  )
}
