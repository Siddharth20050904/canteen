// src/pages/api/register.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { registerUser } from '../../../../server_actions/registerActions'; // Import the action function

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { name, email, password } = req.body;

      // Use the createUser function from registerActions
      const newUser = await registerUser({ name, email, password });

      res.status(201).json(newUser);
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).json({ error: 'An error occurred while creating the user' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
