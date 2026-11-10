import { describe, expect, it, vi } from 'vitest'
import { toast } from 'sonner'
import { shareContent } from './share-utils'

vi.mock('sonner', () => ({ toast: { success: vi.fn(), error: vi.fn() } }))

const DATA = { title: 'Tu turno', text: 'Hola Ana' }

const stubNavigator = (options: { canShare?: boolean, share?: () => Promise<void>, writeText?: () => Promise<void> }) => {
  const share = vi.fn(options.share ?? (async () => {}))
  const writeText = vi.fn(options.writeText ?? (async () => {}))
  vi.stubGlobal('navigator', {
    ...(options.canShare !== undefined && { canShare: () => options.canShare }),
    share,
    clipboard: { writeText }
  })
  return { share, writeText }
}

const abortError = () => Object.assign(new Error('cancelled'), { name: 'AbortError' })

describe('shareContent', () => {
  it('shares when the browser can', async () => {
    const { share, writeText } = stubNavigator({ canShare: true })

    await shareContent(DATA)

    expect(share).toHaveBeenCalledWith(DATA)
    expect(writeText).not.toHaveBeenCalled()
  })

  it.each([
    ['cannot share this content', false],
    ['has no share support', undefined]
  ])('copies the text when the browser %s', async (_name, canShare) => {
    vi.mocked(toast.success).mockClear()
    const { share, writeText } = stubNavigator({ canShare })

    await shareContent(DATA)

    expect(share).not.toHaveBeenCalled()
    expect(writeText).toHaveBeenCalledWith('Hola Ana')
    expect(toast.success).toHaveBeenCalled()
  })

  it('does nothing when the user closes the share sheet', async () => {
    const { writeText } = stubNavigator({ canShare: true, share: () => Promise.reject(abortError()) })

    await shareContent(DATA)

    expect(writeText).not.toHaveBeenCalled()
  })

  it('copies the text when sharing fails', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    const { writeText } = stubNavigator({ canShare: true, share: () => Promise.reject(new Error('not allowed')) })

    await shareContent(DATA)

    expect(writeText).toHaveBeenCalledWith('Hola Ana')
  })

  it('reports when copying fails too', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    vi.mocked(toast.error).mockClear()
    stubNavigator({ canShare: false, writeText: () => Promise.reject(new Error('denied')) })

    await shareContent(DATA)

    expect(toast.error).toHaveBeenCalled()
  })
})
