import config from "../config";
import { useAuth0 } from "@auth0/auth0-react";
import { useCallback } from "react";

export interface UseDataServiceOutput {
    destroy(request: DestroyRequest): Promise<unknown>;
    insert(request: InsertRequest): Promise<unknown>;
    query<T = unknown>(request: QueryRequest): Promise<T[]>;
    update(request: UpdateRequest): Promise<unknown>;
    getAudioUri(file_key: string): Promise<string>;
    putAudioFile(blob: Blob): Promise<string>;
}

const useDataservice = (): UseDataServiceOutput => {
    const { getAccessTokenSilently } = useAuth0();

    const putAudioFile = useCallback(
        async (blob: Blob): Promise<string> => {
            const token = await getAccessTokenSilently();
            const formData = new FormData();
            formData.append("file", blob);

            const url = `${config.apiBaseUrl}/file`
            const response = await fetch(url, {
                method: "POST",
                body: formData,
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if(!response.ok) {
                throw new Error(await response.text());
            }   
            const data = await response.json();
            return data;
        },
        [getAccessTokenSilently]
    );

    const getAudioUri = useCallback(
        async (file_key: string): Promise<string> => {
            const token = await getAccessTokenSilently();
            const url = `${config.apiBaseUrl}/file/${file_key}`;
            const response = await fetch(url, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if(!response.ok) {
                throw new Error(await response.text());
            }
            const blob = await response.blob();
            const dataUrl = await new Promise<string>((resolve) => {
                const reader = new FileReader();
                reader.onload = () => {
                    const data = reader.result as string;
                    resolve(data);
                };
                reader.readAsDataURL(blob);
            });
            return dataUrl;
        },
        [getAccessTokenSilently]
    );

    const destroy = useCallback(
        async (request: DestroyRequest): Promise<unknown> => {
            const token = await getAccessTokenSilently();
            const url = `${config.apiBaseUrl}/destroy`;
            const response = await fetch(url, {
                method: "POST",
                body: JSON.stringify(request),
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            });
            if(!response.ok) {
                throw new Error(await response.text());
            }
            const data = await response.json();
            return data;
        },
        [getAccessTokenSilently]
    );

    const insert = useCallback(
        async (request: InsertRequest): Promise<unknown> => {
            const token = await getAccessTokenSilently();
            const url = `${config.apiBaseUrl}/insert`;
            const response = await fetch(url, {
                method: "POST",
                body: JSON.stringify(request),
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            });
            if(!response.ok) {
                throw new Error(await response.text());
            }
            const data = await response.json();
            return data;
        },
        [getAccessTokenSilently]
    );

    const query = useCallback(
        async <T = unknown>(request: QueryRequest): Promise<T[]> => {
            const token = await getAccessTokenSilently();
            const url = `${config.apiBaseUrl}/query`;
            const response = await fetch(url, {
                method: "POST",
                body: JSON.stringify(request),
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            });
            if(!response.ok) {
                throw new Error(await response.text());
            }
            const data = await response.json();
            return data;
        },
        [getAccessTokenSilently]
    );

    const update = useCallback(
        async (request: UpdateRequest): Promise<unknown> => {
            const token = await getAccessTokenSilently();
            const url = `${config.apiBaseUrl}/update`;
            const response = await fetch(url, {
                method: "POST",
                body: JSON.stringify(request),
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            });
            if(!response.ok) {
                throw new Error(await response.text());
            }
            const data = await response.json();
            return data;
        },
        [getAccessTokenSilently]
    );

    return { destroy, insert, query, update, getAudioUri, putAudioFile };
};

export default useDataservice;

export interface DestroyRequest {
    table: string;
    where: number[] | { [key: string]: unknown };
}

export interface InsertRequest {
    table: string;
    values: { [key: string]: unknown } | { [key: string]: unknown }[];
}

export interface QueryRequest {
    table: string;
    where?: { [key: string]: unknown };
    skip?: number;
    take?: number;
    select?: string[];
    relations?: string[];
    order?: {
        [key: string]: "ASC" | "DESC";
    };
}

export interface UpdateRequest {
    table: string;
    where: { [key: string]: unknown };
    values: { [key: string]: unknown };
}
