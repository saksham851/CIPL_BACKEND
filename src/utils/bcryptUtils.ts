import bcrypt from 'bcrypt';

const saltRounds = 10;

export const hashPassword = async (password: string): Promise<string> => {
  if (typeof password !== 'string') {
    throw new Error('Password must be a string');
  }

  const salt = await bcrypt.genSalt(saltRounds);
  
  const hashedPassword = await bcrypt.hash(password, salt);

  return hashedPassword;
};

export const comparePasswords = async (password: string, hash: string | undefined): Promise<boolean> => {
  if (!hash) {
    return false; 
  }

  if (typeof password !== 'string') {
    throw new Error('Password must be a string');
  }

  const result = await bcrypt.compare(password, hash);
 
  return result;
};
