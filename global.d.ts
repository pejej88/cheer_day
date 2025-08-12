declare global {
    interface Window {
        Kakao: {
            init: (key: string) => void;
            isInitialized: () => boolean;
            Auth: {
                login: (options: {
                    success: (authObj: { access_token: string }) => void;
                    fail: (err: any) => void;
                    scope?: string;
                }) => void;
                logout: (callback?: () => void) => void;
                getAccessToken: () => string | null;
            };
            API: {
                request: (options: {
                    url: string;
                    success: (res: any) => void;
                    fail: (err: any) => void;
                }) => void;
            };
        };
        google: {
            accounts: {
                id: {
                    initialize: (config: {
                        client_id: string;
                        callback: (response: { credential: string }) => void;
                        auto_select?: boolean;
                        cancel_on_tap_outside?: boolean;
                    }) => void;
                    renderButton: (element: HTMLElement, options: {
                        theme?: 'outline' | 'filled_blue' | 'filled_black';
                        size?: 'large' | 'medium' | 'small';
                        text?: 'signin_with' | 'signup_with' | 'continue_with';
                        shape?: 'rectangular' | 'pill' | 'circle' | 'square';
                        logo_alignment?: 'left' | 'center';
                        width?: string;
                        locale?: string;
                    }) => void;
                    prompt: () => void;
                    disableAutoSelect: () => void;
                };
            };
        };
    }
}

export {}; 