import axios from 'axios'
const apiUrl = import.meta.env.VITE_API_URL;

export const hashPassword = async (password) => {
    if (!password) return "";
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
    return hashHex;
};


export const postData = async (url, formData, options = {}) => {
    try {
        const response = await fetch(apiUrl + url, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("accesstoken")}`,
                'Content-Type': 'application/json',
                ...options.headers
            },
            body: JSON.stringify(formData),
            ...options
        })

        if (response.ok) {
            const data = await response.json()
            return data
        } else {
            const errorData = await response.json()
            return errorData
        }
    } catch (error) {
        console.log("Error:", error)
        return { error: true, message: error.message || "Something went wrong" };
    }
}


export const fetchDataFromApi = async (url) => {
    try {
        const params = {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem("accesstoken")}`,
                "Content-type": "application/json"
            }
        }

        const { data } = await axios.get(apiUrl + url, params);
        return data
    } catch (error) {
        console.log(error);
        return error
    }
}


export const uploadImage = async (url, updatedData) => {

    const params = {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem("accesstoken")}`,
            "Content-type": "multipart/form-data"
        }
    }

    var response;
    await axios.put(apiUrl + url, updatedData, params).then((res) => {
        response = res.data
    })
    return response;


}


export const editData = async (url, updatedData) => {

    const params = {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem("accesstoken")}`,
            "Content-type": "application/json"
        }
    }

    var response;
    await axios.put(apiUrl + url, updatedData, params).then((res) => {
        response = res.data
    })
    return response;


}

export const deleteData = async (url) => {
    const params = {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem("accesstoken")}`,
            "Content-type": "application/json"
        }
    }
    try {
        const res = await axios.delete(apiUrl + url, params)
        return res.data
    } catch (error) {
        console.log(error)
    }
}