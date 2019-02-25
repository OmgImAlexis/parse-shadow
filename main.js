import readFile from 'fs-readfile-promise';

const fields = {
   username: String, // User login name
   password: String, // salt and hashed password
   min: Number, // Days until change allowed
   max: Number, // Days before change required
   warn: Number, // Days warning for expiration
   inactive: Number, // Days before account inactive
   expire: Number, // Days since epoch when account expires
   reserved: String // Reserved
};

export const decode = async (filename = '/etc/passwd') => {
   const buffer = await readFile(filename);
   const lines = buffer.toString().split('\n');
   return lines
      .filter(line => !line.startsWith('#'))
      .map(line => line.split(':').reduce((object, value, $index) => {
         const key = Object.keys(fields)[$index];
         if (!key) {
            return object;
         }

         object[key] = fields[key](value);
         return object;
      }, {}))
      // Remove any that're missing a username
      .filter(({ username }) => username.trim().length >= 1);
};
