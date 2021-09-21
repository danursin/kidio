import axios, { AxiosInstance } from "axios";

import { useCallback } from "react";

export interface UseDataServiceOutput {
    _axios: AxiosInstance;
    destroy(request: DestroyRequest): Promise<unknown>;
    insert(request: InsertRequest): Promise<unknown>;
    query<T = unknown>(request: QueryRequest): Promise<T[]>;
    update(request: UpdateRequest): Promise<unknown>;
}

const _axios = axios.create({
    //baseURL: "http://localhost:2500/kidio"
    baseURL: "https://cookoff-2020-api.herokuapp.com/kidio"
});

const useDataservice = (): UseDataServiceOutput => {
    const destroy = useCallback(async (request: DestroyRequest): Promise<unknown> => {
        const { data } = await _axios.post("/destroy", request);
        return data;
    }, []);

    const insert = useCallback(async (request: InsertRequest): Promise<unknown> => {
        const { data } = await _axios.post("/insert", request);
        return data;
    }, []);

    const query = useCallback(async <T = unknown>(request: QueryRequest): Promise<T[]> => {
        const { data } = await _axios.post<T[]>("/query", request);
        return data;
    }, []);

    const update = useCallback(async (request: UpdateRequest): Promise<unknown> => {
        const { data } = await _axios.post("/update", request);
        return data;
    }, []);

    return { _axios, destroy, insert, query, update };
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
