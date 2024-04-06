interface IErrorResponse {
    data: Record<any, any> | null;
    message: string;
    metaData: {
        status: number;
        error: boolean;
    };
}

interface ISuccessResponse {
    data: Record<any, any> | null;
    message: string;
    metaData: {
        status: number;
        error: boolean;
    };
}

export { IErrorResponse, ISuccessResponse };
