export const login = async (name: any) => {
    const body = {
        name: name,
    }
    let r = await fetch('/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            credentials: "same-origin"
        },
        body: JSON.stringify(body),
    })
    let d = await r.json()
    return d;
}

export const logout = async () => {
    let r = await fetch(`${process.env.NEXT_PUBLIC_APP_HOST}/api/logout`);
    let d = await r.json()
    return d;
}

export const addTopic = async (content: string) => {
    const body = {
        content
    }
    let r = await fetch('/api/topic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    })
    let d = await r.json()
    return d;
}

export const getTopics = async () => {
    let r = await fetch(`${process.env.NEXT_PUBLIC_APP_HOST}/api/topic`)
    let d = await r.json();
    return d;
}

export const getTopic = async (id: string) => {
    let r = await fetch(`${process.env.NEXT_PUBLIC_APP_HOST}/api/topic?id=${id}`)
    let d = await r.json();
    return d;
}

export const getLike = async (object: string, objectid: string) => {
    let r = await fetch(`/api/like?object=${object}&objectid=${objectid}`, {
        credentials: "same-origin"
    })
    let d = await r.json()
    return d;
}

export const addLike = async (object: string, objectid: string) => {
    const body = {
        object,
        objectid
    }
    let r = await fetch('/api/like', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    })
    let d = await r.json()
    return d;
}

export const removeLike = async (object: string, objectid: string) => {
    const body = {
        object,
        objectid
    }
    let r = await fetch('/api/like', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    })
    let d = await r.json()
    return d;
}

export const addComment = async (object: string, objectid: string, content: string) => {
    const body = {
        object,
        objectid,
        content
    }
    let r = await fetch('/api/comment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    })
    let d = await r.json()
    return d;
}