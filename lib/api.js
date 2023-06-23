import Error from "next/error";

export async function uploadImage(base64Image, token) {
    const response = await fetch(`/api/upload`, {
        method: "POST", headers: {
            "content-type": "application/json"
        }, body: JSON.stringify({base64Image})
    })

    if (!response.ok) {
        let error = new Error("Picture could not been uploaded")
        error.response = response
        throw error
    }
    return await response.json()
}

export async function login({email, password}) {
    const response = await fetch(`api/login`, {
        method: "POST", headers: {
            "content-type": "application/json"
        }, body: JSON.stringify({email, password})
    })

    if (!response.ok) {
        return Promise.reject(response)
    }

    return {user: convertUser(await response.json())}
}

export async function register({email, password, name, avatar, bio, follows}) {
    const response = await fetch(`api/register`, {
        method: "POST", headers: {
            "content-type": "application/json"
        }, body: JSON.stringify({email, password, name, avatar, bio, follows})
    })

    if (!response.ok) {
        return Promise.reject(response)
    }


    return convertUsers(await response.json());
}

export async function getUserById(id, token) {
    console.log(id)

    const response = await fetch(`api/getUser/${id}`)
    return convertUser(await response.json())
}

export async function updateUser(user, token) {
    const response = await fetch(`api/users/${user.id}`, {
        method: "PATCH", headers: {
            "content-type": "application/json",
        }, body: JSON.stringify(user)
    })

    if (response.status !== 200) {
        let error = new Error("Post could not be updated")
        error.response = response
        throw error
    }
    return await response.json()
}

export async function getAllUsers() {
    const response = await fetch(`api/getUsers`)
    return convertUsers(await response.json())
}

export async function getCommentsByPostId(postId) {

    const response = await fetch(`api/getCommentByPostId/${postId}`)
    return convertComments(await response.json())
}

export async function createComment(comment, token) {
    const response = await fetch(`api/comments`, {
        method: "POST", headers: {
            "content-type": "application/json"
        }, body: JSON.stringify(comment)
    })

    if (response.status !== 201) {
        let error = new Error("Post could not be created")
        error.response = response
        throw error
    }

    return convertComment(await response.json());
}

export async function updateComment(comment, token) {
    const response = await fetch(`api/comments/${comment.id}`, {
        method: "PUT", headers: {
            "content-type": "application/json"
        }, body: JSON.stringify(comment)
    })

    if (!response.ok) {
        let error = new Error("Post could not been updated")
        error.response = response
        throw error
    }
    return convertComment(await response.json())
}

export async function deleteComment(id, token) {
    const response = await fetch(`api/comments/${id}`, {
        method: "DELETE", headers: {
            "content-type": "application/json"
        }
    })

    if (!response.ok) {
        let error = new Error("Comment could not been deleted")
        error.response = response
        throw error
    }
}

export async function deleteCommentByOwnerId(id, token) {
    const response = await fetch(`api/comments/${id}`, {
        method: "DELETE", headers: {
            "content-type": "application/json", "authorization": `Bearer ${token}`
        }
    })

    if (!response.ok) {
        let error = new Error("Comment could not been deleted")
        error.response = response
        throw error
    }
}


export async function getAllPosts() {
    const response = await fetch(`api/getPosts`)
    return convertPosts(await response.json());
}

export async function getPostById(id, token) {

    const response = await fetch(`api/posts/${id}`)
    return convertPost(await response.json());
}

export async function createPost(post, token) {
    const response = await fetch(`api/createPost`, {
        method: "POST", headers: {
            "content-type": "application/json"
        }, body: JSON.stringify(post)
    })

    if (response.status !== 201) {
        let error = new Error("Post could not be created")
        error.response = response
        throw error
    }
    return convertPost(await response.json())
}

export async function updatePost(post, token) {
    const response = await fetch(`api/updatePost/${post.id}`, {
        method: "PUT", headers: {
            "content-type": "application/json"
        }, body: JSON.stringify(post)
    })

    if (!response.ok) {
        let error = new Error("Post could not be updated")
        error.response = response
        throw error
    }
    return convertPost(await response.json())
}

export async function deletePost(id, token) {
    const response = await fetch(`api/deletePost/${id}`, {
        method: "DELETE", headers: {
            "content-type": "application/json"
        }
    })

    if (!response.ok) {
        let error = new Error("Post could not been deleted")
        error.response = response
        throw error
    }
}

export function convertPosts(object) {
    let converted = []
    converted = object.map(o => {
        return convertPost(o)
    })
    return converted
}

export function convertPost(o) {
    return {
        id: o._id,
        title: o.title,
        content: o.content,
        ownerId: o.ownerId,
        avatar: o.avatar,
        likes: o.likes,
        createdAt: o.createdAt,
        updatedAt: o.updatedAt,
    }
}

export function convertUsers(object) {
    let converted = []
    converted = object.map(o => {
        return convertUser(o)
    })
    return converted
}

export function convertUser(o) {
    return {
        id: o._id,
        email: o.email,
        name: o.name,
        avatar: o.avatar,
        bio: o.bio,
        follows: o.follows,
    }
}

export function convertComments(object) {
    let converted = []
    if (object.length > 0) {
        converted = object.map(o => {
            return convertComment(o)
        })
        return converted
    } else {
        return []
    }
}

export function convertComment(o) {
    return {
        id: o._id,
        postId: o.postId,
        ownerId: o.ownerId,
        content: o.content,
        createdAt: o.createdAt,
        updatedAt: o.updatedAt,
    }
}