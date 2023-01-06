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
      <p className='text-lg'>Precio: {formatPrice(price)} <small>(Restan: {formatPrice(price - deposit)})</small></p>
      <div className="flex items-center my-2">
        Abonado:
        {
          showInput
            ? (
              <div className='relative'>
                <input
                  className="p-2 mx-2 rounded-lg outline-none focus:ring focus:ring-rose-400"
                  onChange={(e) => setNewDeposit(e.target.value)}
                  type='number'
                  value={newDeposit}
                />
                <button className='absolute px-2 py-1 rounded right-14 bottom-1 bg-rose-400' onClick={handleConfirm}>
                  <CheckIcon className='w-6 h-6 text-rose-200' />
                </button>
                <button className='absolute px-2 py-1 rounded right-3 bottom-1 bg-rose-200' onClick={handleCancel}>
                  <CancelIcon className='w-6 h-6 text-rose-400' />
                </button>
              </div>
            )
            : (
              <p className='flex items-center p-2' onClick={() => setShowInput(!showInput)}>
                {formatPrice(deposit)}
                <EditIcon className='w-4 h-4 ml-1 text-rose-700' />
              </p>
            )
        }
      </div>
    </>
  )
}
