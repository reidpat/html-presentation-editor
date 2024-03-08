import type { RequestHandler } from '@sveltejs/kit';
import { promises as fs } from 'fs';
import path from 'path';

export const POST: RequestHandler = async ({ request }) => {
    try {
        // Parse JSON body from the request
        const { filename, content } = await request.json();

        // Define the path to the file
        const filePath = path.resolve('static/slides', filename);

        // Write the content to the file
        await fs.writeFile(filePath, content);

        return new Response('File saved successfully', {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (error: any) {
        // Handle errors, including file writing errors and JSON parsing errors
        console.error('Error:', error);
        return new Response(`Error: ${error.message}`, {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
};
