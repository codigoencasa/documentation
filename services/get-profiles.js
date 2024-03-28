import { cache, ttl } from "./cache"

const GH_URL = 'https://api.github.com/users'

/**
 * Retrieve all profiles
 * @returns 
 */
export const getProfiles = async (payload = []) => {
    payload = payload.map((c) => c.toLowerCase())

    let contributors

    const fetchUser = async (username) => {
        const cached = await cache.get(`contributors-${username}`)
        if (cached) {
            return cached
        }

        const res = await fetch(`${GH_URL}/${username}`, { next: { revalidate: 3600 } })
        
        if (!res.ok) {
            throw new Error(`Failed to fetch GitHub user: ${username}`)
        }

        const json = await res.json()
        await cache.set(`contributors-${username}`, json, ttl)
        return json
    }

    contributors = await Promise.all(payload.map(async (username) => {
        try {
            const user = await fetchUser(username)
            return {
                id: user.id,
                name: user.login.toLowerCase(),
                avatar: user.avatar_url,
                profile: user.html_url,
                contributions: user.contributions,
            }
        } catch (error) {
            console.error(error.message)
            return null
        }
    }))


    const parse = contributors.filter(contributor => contributor !== null)
    return parse
}

