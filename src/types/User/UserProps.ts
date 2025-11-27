export interface Vehicle {
    id: string;
    plate: string;
    model: string;
    brand: string;
    capacity_kg: string;
}

export interface User {
    userid: string;
    username: string;
    first_name: string;
    last_name: string;
    email: string;
    image_url: string | null;
    gender: string;
    phone: string;
    age: number;
    role: string;
    is_online: boolean;
    is_available: boolean;
    current_vehicle: Vehicle | null;
    current_vehicle_id: string | null;
    rating_average: number | null;
    rating_count: number;
}
