// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import DateField from './date-field-new'

afterEach(cleanup)

// 10:00 in Argentina
const date = '2026-05-01T13:00:00.000Z'

const startEditing = (onChange = vi.fn()) => {
  const { container } = render(<DateField date={date} onChange={onChange} />)
  fireEvent.click(screen.getByText(/1 may/i))
  const dateInput = container.querySelector('input[type=date]') as HTMLInputElement
  const timeSelect = screen.getByRole('combobox') as HTMLSelectElement
  const confirm = () => fireEvent.click(screen.getByRole('button'))
  return { onChange, dateInput, timeSelect, confirm }
}

describe('DateField', () => {
  it('starts from the date and time in Argentina', () => {
    const { dateInput, timeSelect } = startEditing()
    expect(dateInput.value).toBe('2026-05-01')
    expect(timeSelect.value).toBe('10:00')
  })

  it('saves the new time as an instant in Argentina', () => {
    const { onChange, timeSelect, confirm } = startEditing()

    fireEvent.change(timeSelect, { target: { value: '23:45' } })
    confirm()

    expect(onChange).toHaveBeenCalledWith('2026-05-02T02:45:00.000Z')
  })

  it('keeps the last valid date while the date input is empty', () => {
    const { onChange, dateInput, timeSelect, confirm } = startEditing()

    fireEvent.change(timeSelect, { target: { value: '11:00' } })
    fireEvent.change(dateInput, { target: { value: '' } })
    confirm()

    expect(onChange).toHaveBeenCalledWith('2026-05-01T14:00:00.000Z')
  })

  it('does not save when nothing changed', () => {
    const { onChange, confirm } = startEditing()
    confirm()
    expect(onChange).not.toHaveBeenCalled()
  })
})
