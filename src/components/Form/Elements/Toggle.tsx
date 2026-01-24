import { Switch } from '@headlessui/react'

type Props = {
  label: string
  checked?: boolean
  onChange: (checked: boolean) => void
}

export default function Toggle ({ label, checked = false, onChange }: Props) {
  return (
    <Switch.Group>
      <div className="flex items-center py-2 m-2">
        <Switch.Label className="mr-4">{label}</Switch.Label>
        <Switch
          checked={checked}
          onChange={onChange}
          className={`${
            checked ? 'bg-rose-600' : 'bg-gray-200'
          } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-hidden focus:ring-2 focus:ring-rose-500 focus:ring-offset-2`}
        >
          <span
            className={`${
              checked ? 'translate-x-6' : 'translate-x-1'
            } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
          />
        </Switch>
      </div>
    </Switch.Group>
  )
}
