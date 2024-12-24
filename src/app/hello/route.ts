export const users = [
    {id: 1, name: 'John Doe'},
];

export async function GET() {
    return Response.json(users);
}