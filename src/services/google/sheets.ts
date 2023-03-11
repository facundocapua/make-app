import { makeApiCall } from '../google'

type AppendRowRequest = <T>({ spreadsheetId, range, data, accessToken }: {spreadsheetId: string, range: string, data: T, accessToken: string}) => Promise<any>

export const appendRow:AppendRowRequest = ({ spreadsheetId, range, data, accessToken }) => {
  const params: {[key: string]: string} = {
    includeValuesInResponse: 'true',
    insertDataOption: 'INSERT_ROWS',
    responseDateTimeRenderOption: 'FORMATTED_STRING',
    responseValueRenderOption: 'FORMATTED_VALUE',
    valueInputOption: 'USER_ENTERED'
  }

  return makeApiCall({
    url: `/v4/spreadsheets/${spreadsheetId}/values/${range}:append?${new URLSearchParams(params)}`,
    accessToken,
    method: 'POST',
    service: 'sheets',
    data
  }).then(res => res.json())
    .then(res => {
      return res
    })
}
