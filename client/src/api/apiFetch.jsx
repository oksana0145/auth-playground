import { refresh } from "./authApi"

export const apiFetch = async ({
    url,
    options = {},
    accessToken,
    updateAccessToken,
    logoutUser,
}) => {
    const sendRequest = async (token) => {
        return fetch (url, {
            ...options,
            headers: {
                ...options.headers,
                Authorization: `Bearer ${token}`,
            },
            credentials: "include",
        })
    }

    let response = await sendRequest(accessToken)

    if (response.status !== 401) {
        return response
    }

    try {
        const refreshData = await refresh()

        const newAccessToken = refreshData.accessToken

        updateAccessToken(newAccessToken)

        response = await sendRequest(newAccessToken)

        return response
    } catch (error) {
        logoutUser()
        throw error
    }
}

export const logout = async () => {
    const response = await fetch (`${API_URL}/logout`, {
        method: "POST",
        credentials: "include",
    })
    return handleResponse(response)
}