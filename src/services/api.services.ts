import { api } from 'src/boot/axios';
import { handleMessages } from 'src/utils/notify';
import { AxiosError, AxiosRequestConfig } from 'axios';

const translateErrorMessage = (): string => {
    return 'Oops, hubo un problema durante el proceso, intente de nuevo';
};

const buildQueryString = (params: object): string => {
    return Object.entries(params)
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
        .join('&');
};

interface GetDataProps {
    path: string;
    payload?: object;
}

export const getData = async <T>({ path, payload }: GetDataProps): Promise<T> => {
    try {
        const queryString = payload ? `?${buildQueryString(payload)}` : '';
        const { data } = await api.get(`${path}${queryString}`);
        return data;
    } catch (error) {
        handleMessages({
            message: 'Oops, por favor intente de nuevo',
            color: 'red-4',
            icon: 'cancel',
        });
        throw error;
    }
};

interface PostDataProps {
    path: string;
    payload: unknown;
    headers?: AxiosRequestConfig;
    message?: string;
}

export const postData = async (data: PostDataProps) => {
    const { path, payload, headers, message } = data;
    try {
        const { data } = await api.post(path, payload, headers);
        if (data.error == 'Unauthorized, loginout...') {
            return;
        }
        if (message) {
            handleMessages({
                message: message,
                color: 'positive',
                icon: 'check',
            });
        }

        return data;
    } catch (error: unknown) {
        let msg: string | undefined;
        const defaultMsg =
            'Oops, hubo un problema durante el proceso, por favor intente mas tarde';
        if (error instanceof AxiosError) {
            msg = error.response?.data?.message;
        }
        handleMessages({
            message: msg || defaultMsg,
            color: 'negative',
            icon: 'cancel',
        });
        throw error;
    }
};

export const deleteData = async (path: string) => {
    try {
        const { data } = await api.delete(path);
        handleMessages({
            message: 'Se ha eliminado exitosamente!',
            color: 'positive',
            icon: 'check',
        });
        return data;
    } catch (error) {
        handleMessages({
            message:
                'Oops, hubo un problema durante el proceso, por favor intente mas tarde',
            color: 'negative',
            icon: 'cancel',
        });
        throw error;
    }
};

export const putData = async (data: PostDataProps) => {
    const { path, payload, headers } = data;
    try {
        const { data } = await api.put(path, payload, headers);
        handleMessages({
            message: 'Se ha actualizado exitosamente!',
            color: 'positive',
            icon: 'check',
        });
        return data;
    } catch (error: unknown) {
        let msg: string | undefined;
        if (error instanceof AxiosError) {
            msg = error.response?.data.error;
        }
        handleMessages({
            message: msg || translateErrorMessage(),
            color: 'negative',
            icon: 'cancel',
        });
        throw error;
    }
};
