import { useMutation } from '@tanstack/react-query'
import { InferRequestType, InferResponseType } from 'hono'

import { client } from '@/lib/hono'

type ResponseType = InferResponseType<typeof client.api.signup.$post>
type RequestType = InferRequestType<typeof client.api.signup.$post>['json']

export const useSignUp = () => {
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async json => {
      const response = await client.api.signup.$post({ json })

      if (!response.ok) {
        const { error } = await response.json()
        throw new Error(error)
      }

      const { data } = await response.json()

      return data
    },
    onError: error => {
      console.error(error)
    }
  })

  return mutation
}
