// @vitest-environment jsdom
import { act, cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { makeEvent } from '@/test/event'
import { loadArchiveYearAction } from './actions'
import ArchiveList from './client'

vi.mock('./actions', () => ({ loadArchiveYearAction: vi.fn() }))
vi.mock('next/navigation', () => ({ useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }) }))
vi.mock('@/components/Events/event-modal/actions', () => ({ deleteItem: vi.fn() }))

// jsdom has no layout, so the test decides when the end of the list is visible
let setVisible: (visible: boolean) => Promise<void>

beforeEach(() => {
  vi.clearAllMocks()
  vi.stubGlobal('IntersectionObserver', class {
    constructor (callback: (entries: Array<{ isIntersecting: boolean }>) => void) {
      setVisible = async (visible) => {
        await act(async () => callback([{ isIntersecting: visible }]))
      }
    }

    observe () {}
    disconnect () {}
  })
})

afterEach(cleanup)

const recent = makeEvent('recent', '2026-10-01T13:00:00.000Z', { fullName: 'Reciente' })
const old = makeEvent('old', '2025-03-01T13:00:00.000Z', { fullName: 'Vieja' })
const older = makeEvent('older', '2022-03-01T13:00:00.000Z', { fullName: 'Antigua' })

describe('ArchiveList', () => {
  it('loads the previous year when the end of the list becomes visible', async () => {
    vi.mocked(loadArchiveYearAction).mockResolvedValueOnce({ events: [old], nextBefore: null })
    render(<ArchiveList initialEvents={[recent]} initialNextBefore='2025-11-12T03:00:00.000Z' />)

    expect(screen.getByText('Reciente')).toBeDefined()
    expect(loadArchiveYearAction).not.toHaveBeenCalled()

    await setVisible(true)

    expect(loadArchiveYearAction).toHaveBeenCalledWith('2025-11-12T03:00:00.000Z')
    expect(await screen.findByText('Vieja')).toBeDefined()
    expect(loadArchiveYearAction).toHaveBeenCalledTimes(1)
  })

  it('keeps loading through empty years while the end stays visible', async () => {
    vi.mocked(loadArchiveYearAction)
      .mockResolvedValueOnce({ events: [], nextBefore: '2024-11-12T03:00:00.000Z' })
      .mockResolvedValueOnce({ events: [older], nextBefore: null })
    render(<ArchiveList initialEvents={[recent]} initialNextBefore='2025-11-12T03:00:00.000Z' />)

    await setVisible(true)

    expect(await screen.findByText('Antigua')).toBeDefined()
    expect(vi.mocked(loadArchiveYearAction).mock.calls).toEqual([
      ['2025-11-12T03:00:00.000Z'],
      ['2024-11-12T03:00:00.000Z']
    ])
  })

  it('shows each event once when two years return it', async () => {
    vi.mocked(loadArchiveYearAction).mockResolvedValueOnce({ events: [recent, old], nextBefore: null })
    render(<ArchiveList initialEvents={[recent]} initialNextBefore='2025-11-12T03:00:00.000Z' />)

    await setVisible(true)

    await screen.findByText('Vieja')
    expect(screen.getAllByText('Reciente')).toHaveLength(1)
  })

  it('offers a retry when a year fails to load', async () => {
    vi.mocked(loadArchiveYearAction)
      .mockRejectedValueOnce(new Error('offline'))
      .mockResolvedValueOnce({ events: [old], nextBefore: null })
    render(<ArchiveList initialEvents={[recent]} initialNextBefore='2025-11-12T03:00:00.000Z' />)

    await setVisible(true)
    await userEvent.click(await screen.findByRole('button', { name: /Reintentar/ }))

    expect(await screen.findByText('Vieja')).toBeDefined()
    expect(screen.queryByRole('button', { name: /Reintentar/ })).toBeNull()
  })

  it('says there are no appointments when the calendar is empty', () => {
    render(<ArchiveList initialEvents={[]} initialNextBefore={null} />)
    expect(screen.getByText('No hay turnos')).toBeDefined()
  })
})
