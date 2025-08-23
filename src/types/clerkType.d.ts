
export interface UserCreatedEvent {
    id: string;
    type: 'user.created';
    data: {
        id: string;
        email_addresses: { email_address: string }[];
        first_name?: string;
        last_name?: string;
        username?: string;
        created_at: number;
        updated_at: number;
        [key: string]: any;
    };
}
