async function callFetch({
    method,
    url,
    contentType = "application/json",
    body,
    authorization,
}: {
    method: string;
    url: string;
    contentType?: string;
    body?: any;
    authorization?: string;
}): Promise<any> {
    const headers: HeadersInit = {
        "Content-Type": contentType,
    };

    if (authorization) {
        headers["Authorization"] = authorization;
    }

    const options: RequestInit = {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
    };

    try {
        const response = await fetch(url, options);

        if (!response.ok) {
            throw new Error(
                `Failed to fetch: ${response.status} ${response.statusText}`
            );
        }

        const data = await response.text();
        return data;
    } catch (error: any) {
        console.error("API request using fetch failed: ", error.message.trim());
        throw error;
    }
}

export default callFetch;
