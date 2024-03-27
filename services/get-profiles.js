import { cache } from "./cache"

const GH_URL = 'https://api.github.com/repos/codigoencasa/documentation/contributors'
/**
 * Retrieve all profiles
 * @returns 
 */
export const getProfiles = async (payload = []) => {
    payload = payload.map((c) => c.toLowerCase())
    
    let response
    const cached = await cache.get('contributors')
    
    if (cached) {
        console.log('***Using Cache***')
        response = JSON.parse(cached)
    }else{ 
        console.log('***Using Fetching***')
        const res = await fetch(GH_URL, {
            next: { revalidate: 3600 },
        })
    
        if (!res.ok) {
            throw new Error('Failed to fetch API')
        }

        response = await res.json()
        await cache.set('contributors', JSON.stringify(response), 3600 * 1000)
    }

    const contributors = response.map((contributor) => {
        return {
            id: contributor.id,
            name: contributor.login,
            avatar: contributor.avatar_url,
            profile: contributor.html_url,
            contributions: contributor.contributions,
        }
    })

    const parse = contributors.reduce((prev, current) => {
        current.name = current.name.toLowerCase()
        if (payload.includes(current.name)) {
            prev.push(current)
            return prev
        }
        return prev
    }, [])

    return parse
}