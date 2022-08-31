// import { useEffect } from 'react'
// import Router from 'next/router'
// import useSWR from 'swr'

// export function useUser() {
//     const { data, error } = useSWR('/api/user', (url: any) => fetch(url).then(r => r.json()))

//     return {
//         user: data && data.id ? data : null,
//         isLoading: !error && !data,
//         isError: error
//     }
// }

import { useEffect } from 'react'
import Router from 'next/router'
import useSWR from 'swr'

export function useUser() {
    const { data: user, mutate: mutateUser } = useSWR<any>('/api/user', (url: any) => fetch(url).then(r => r.json()))

    return { user: user && user.id ? user : null, mutateUser }
}