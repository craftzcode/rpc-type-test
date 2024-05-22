import { useMutation } from '@tanstack/react-query'
import { InferRequestType, InferResponseType } from 'hono'

import { client } from '@/lib/hono'

//! This (ResponseType) is it's either ({ error: string }) or ({ data: string})
// type ResponseType = InferResponseType<
//   typeof client.api.signup.$post
// >

//! So we modify the (ResponseType) to return only ({ data: string }), so we can destructure the ({ data }) from (await response.json())
type ResponseType = InferResponseType<
  typeof client.api.signup.$post,
  200
>['data']
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
