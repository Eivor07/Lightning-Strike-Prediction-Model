const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export async function getRiskZones() {
    const response = await fetch(`${API_URL}/zones`);
    if (!response.ok) throw new Error('Failed to fetch risk zones');
    return response.json();
}

export async function predictRisk(data: any) {
    const response = await fetch(`${API_URL}/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to predict risk');
    return response.json();
}
