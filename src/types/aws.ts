import {
    APIGatewayEventRequestContext as APIGatewayEventRequestContextBase,
    APIGatewayProxyCognitoAuthorizer,
} from 'aws-lambda';

export interface Headers {
    [name: string]: string;
}

export interface APIGatewayEvent<TBody> {
    body: TBody;
    headers: Headers;
    multiValueHeaders: { [name: string]: string[] };
    httpMethod: string;
    isBase64Encoded: boolean;
    path: string;
    pathParameters: { [name: string]: string };
    queryStringParameters: { [name: string]: unknown };
    multiValueQueryStringParameters: { [name: string]: unknown[] };
    stageVariables: { [name: string]: string } | null;
    requestContext: APIGatewayEventRequestContext;
    resource: string;
}

export interface APIGatewayEventRequestContext
    extends APIGatewayEventRequestContextBase {
    authorizer: Identity;
}
export interface Identity extends APIGatewayProxyCognitoAuthorizer {
    scope: string;
    principalId: string;
    role: string;
}

export interface AuthParams {
    type: string;
    authorizationToken?: string;
    queryStringParameters: { [key: string]: string };
    methodArn: string;
}

export interface AuthorizerResponse {
    principalId: string;
    policyDocument: {
        Version: string;
        Statement: {
            Action: string;
            Effect: string;
            Resource: string;
        }[];
    };
    context?: CognitoTokenPayload;
}

export interface CognitoTokenPayload {
    at_hash: string;
    sub: string;
    aud: string;
    email_verified: boolean;
    token_use: string;
    auth_time: number;
    iss: string;
    'cognito:username': string;
    exp: number;
    given_name: string;
    iat: number;
    email: string;
    'cognito:groups': string[];
    groups: string;
}

export interface DefaultResponse {
    success: true;
}
