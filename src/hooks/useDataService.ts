import axios, { AxiosInstance } from "axios";

import config from "../config";
import { useAuth0 } from "@auth0/auth0-react";
import { useCallback } from "react";

export interface UseDataServiceOutput {
    _axios: AxiosInstance;
    destroy(request: DestroyRequest): Promise<unknown>;
    insert(request: InsertRequest): Promise<unknown>;
    query<T = unknown>(request: QueryRequest): Promise<T[]>;
    update(request: UpdateRequest): Promise<unknown>;
    getAudioUri(file_key: string): Promise<string>;
    putAudioFile(blob: Blob): Promise<string>;
}

const _axios = axios.create({
    baseURL: config.apiBaseUrl
});

const useDataservice = (): UseDataServiceOutput => {
    const { getAccessTokenSilently } = useAuth0();

    const putAudioFile = useCallback(
        async (blob: Blob): Promise<string> => {
            const token = await getAccessTokenSilently();
            const formData = new FormData();
            formData.append("file", blob);
            const {
                data: { file_key }
            } = await _axios.post<{ file_key: string }>("/file", formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data"
                }
            });
            return file_key;
        },
        [getAccessTokenSilently]
    );

    const getAudioUri = useCallback(
        async (file_key: string): Promise<string> => {
            const token = await getAccessTokenSilently();
            const { data } = await _axios.get<Blob>("/file", {
                params: { file_key },
                headers: {
                    Authorization: `Bearer ${token}`
                },
                responseType: "blob"
            });
            const dataUrl = await new Promise<string>((resolve) => {
                const reader = new FileReader();
                reader.onload = () => {
                    const data = reader.result as string;
                    resolve(data);
                };
                reader.readAsDataURL(data);
            });
            return dataUrl;
        },
        [getAccessTokenSilently]
    );

    const destroy = useCallback(
        async (request: DestroyRequest): Promise<unknown> => {
            const token = await getAccessTokenSilently();
            const { data } = await _axios.post("/destroy", request, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return data;
        },
        [getAccessTokenSilently]
    );

    const insert = useCallback(
        async (request: InsertRequest): Promise<unknown> => {
            const token = await getAccessTokenSilently();
            const { data } = await _axios.post("/insert", request, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return data;
        },
        [getAccessTokenSilently]
    );

    const query = useCallback(
        async <T = unknown>(request: QueryRequest): Promise<T[]> => {
            const token = await getAccessTokenSilently();
            const { data } = await _axios.post<T[]>("/query", request, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return data;
        },
        [getAccessTokenSilently]
    );

    const update = useCallback(
        async (request: UpdateRequest): Promise<unknown> => {
            const token = await getAccessTokenSilently();
            const { data } = await _axios.post("/update", request, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return data;
        },
        [getAccessTokenSilently]
    );

    return { _axios, destroy, insert, query, update, getAudioUri, putAudioFile };
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
