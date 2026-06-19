import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { supabase } from '../config/supabase.js';

export const syncUserProfile = async (req: AuthenticatedRequest, res: Response) => {
  const user = req.user;
  if (!user) {
    return res.status(400).json({ error: 'Missing authenticated user payload.' });
  }

  const { uid, phone } = user;
  const { name, email, role } = req.body;

  console.log(`Syncing profile for uid: ${uid}, phone: ${phone}, name: ${name}, role: ${role}`);

  try {
    const { data, error } = await supabase
      .from('profiles')
      .upsert({
        id: uid,
        phone: phone || '',
        name: name || '',
        email: email || '',
        role: role || 'user',
        updated_at: new Date().toISOString(),
      })
      .select();

    if (error) {
      console.error('Supabase error during sync:', error);
      return res.status(500).json({ error: error.message });
    }

    console.log('Profile synced successfully:', data);
    return res.json({ 
      success: true, 
      profile: data && data.length > 0 ? data[0] : null 
    });
  } catch (error: any) {
    console.error('Unhandled error during sync:', error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
};

export const getUserProfile = async (req: AuthenticatedRequest, res: Response) => {
  const user = req.user;
  if (!user) {
    return res.status(400).json({ error: 'Missing authenticated user payload.' });
  }

  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.uid)
      .single();

    if (error) {
      return res.status(404).json({ error: 'Profile not found.' });
    }

    return res.json({ success: true, profile: data });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};
