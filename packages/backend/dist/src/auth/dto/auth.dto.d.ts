export declare class MockLoginDto {
    email: string;
    name: string;
}
export declare class AuthResponseDto {
    access_token: string;
    user: {
        id: string;
        email: string;
        name: string;
        role: string;
    };
}
