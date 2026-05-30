import axios from 'axios'
const apiUrl = import.meta.env.VITE_API_URL?.replace(/\/$/, "");

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
                'Authorization': `Bearer ${localStorage.getItem("accesstoken")}`,
                "Content-type": "application/json",
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
        response = res
    })
    return response;


}


export const uploadImages = async (url, formData) => {
    try {
        const params = {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem("accesstoken")}`
                // Don't set Content-type manually - axios will set it automatically with boundary for FormData
            }
        }

        const response = await axios.post(apiUrl + url, formData, params);
        return response;
    } catch (error) {
        console.error("Upload error:", error);
        throw error;
    }
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
        response = res
    })
    return response;


}

export const deleteImage = async (url) => {
    try {
        const params = {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem("accesstoken")}`,
                "Content-type": "application/json"
            }
        }
        const response = await axios.delete(apiUrl + url, params);
        return response;
    } catch (error) {
        console.error("Delete image error:", error);
        throw error;
    }
}



export const deleteData = async (url) => {
    try {
        const params = {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem("accesstoken")}`,
                "Content-type": "application/json"
            }
        }
        const response = await axios.delete(apiUrl + url, params);
        return response;
    } catch (error) {
        console.error("Delete image error:", error);
        throw error;
    }
}

export const deleteMultipleData = async (url, data) => {
    try {
        // Extract data property if nested, otherwise use data directly
        const requestData = data?.data || data;
        const response = await axios({
            method: 'DELETE',
            url: apiUrl + url,
            headers: {
                'Authorization': `Bearer ${localStorage.getItem("accesstoken")}`,
                "Content-type": "application/json"
            },
            data: requestData
        });
        return response;
    } catch (error) {
        console.error("Delete multiple data error:", error);
        throw error;
    }
}