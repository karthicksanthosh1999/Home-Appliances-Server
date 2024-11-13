export interface IApiResponse<T>  {
    message : string,
    statuscode : number,
    success : boolean,
    token? : string,
    responses? : T,
    error? : null | string
}