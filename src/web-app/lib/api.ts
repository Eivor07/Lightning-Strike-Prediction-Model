// Fallback for environment variables in client-side code
const API_URL = (typeof process !== 'undefined' ? process.env.NEXT_PUBLIC_API_URL : null) || 'http://localhost:5000';

export interface PredictionRequest {
    latitude: number;
    longitude: number;
    year?: number;
    month?: number;
}

export async function getRiskZones() {
    const response = await fetch(`${API_URL}/zones`);
    if (!response.ok) throw new Error('Failed to fetch risk zones');
    return response.json();
}

export async function predictRisk(data: PredictionRequest | PredictionRequest[]) {
    const response = await fetch(`${API_URL}/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to predict risk');
    return response.json();
}
