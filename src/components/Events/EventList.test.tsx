// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { toast } from 'sonner'
import { makeEvent } from '@/test/event'
import { deleteItem } from './event-modal/actions'
import EventList from './EventList'

const router = { push: vi.fn(), refresh: vi.fn() }
vi.mock('next/navigation', () => ({ useRouter: () => router }))
vi.mock('./event-modal/actions', () => ({ deleteItem: vi.fn() }))
vi.mock('sonner', () => ({ toast: { success: vi.fn(), error: vi.fn() } }))

const event = makeEvent('e1', '2026-05-01T13:00:00.000Z', { fullName: 'ana pérez' })

// The swipe action is in the DOM, behind the item, so a click stands in for the swipe
const deleteButton = () => screen.getByText((_, element) => element?.tagName === 'BUTTON' && element.className.includes('bg-red-500'))

beforeEach(() => {
  vi.clearAllMocks()
  vi.spyOn(window, 'confirm').mockReturnValue(true)
})

afterEach(cleanup)

describe('EventList delete', () => {
  it('does nothing when the deletion is not confirmed', () => {
    vi.mocked(window.confirm).mockReturnValue(false)
    render(<EventList events={[event]} />)

    fireEvent.click(deleteButton())

    expect(window.confirm).toHaveBeenCalledWith(expect.stringContaining('ana pérez'))
    expect(deleteItem).not.toHaveBeenCalled()
  })

  it('reloads the page after deleting', async () => {
    vi.mocked(deleteItem).mockResolvedValue({ ok: true })
    render(<EventList events={[event]} />)

    fireEvent.click(deleteButton())

    await waitFor(() => expect(router.refresh).toHaveBeenCalled())
    expect(deleteItem).toHaveBeenCalledWith('e1')
    expect(toast.success).toHaveBeenCalled()
  })

  it('lets a list that keeps its own events remove it instead of reloading', async () => {
    vi.mocked(deleteItem).mockResolvedValue({ ok: true })
    const onDelete = vi.fn()
    render(<EventList events={[event]} onDelete={onDelete} />)

    fireEvent.click(deleteButton())

    await waitFor(() => expect(onDelete).toHaveBeenCalledWith(event))
    expect(router.refresh).not.toHaveBeenCalled()
  })

  it.each([
    ['returns an error', () => vi.mocked(deleteItem).mockResolvedValue({ ok: false })],
    ['throws', () => vi.mocked(deleteItem).mockRejectedValue(new Error('offline'))]
  ])('shows an error and keeps the event when the action %s', async (_name, setUp) => {
    setUp()
    const onDelete = vi.fn()
    render(<EventList events={[event]} onDelete={onDelete} />)

    fireEvent.click(deleteButton())

    await waitFor(() => expect(toast.error).toHaveBeenCalled())
    expect(onDelete).not.toHaveBeenCalled()
  })
})
