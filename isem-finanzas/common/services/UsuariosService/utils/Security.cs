using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace UsuariosService.utils
{
    public class Security
    {
       public static string RandomString(int length)
        {
            const string valid = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890@#$%&*";
            StringBuilder res = new StringBuilder();
            using (RNGCryptoServiceProvider rng = new RNGCryptoServiceProvider())
            {
                byte[] uintBuffer = new byte[sizeof(uint)];

                while (length-- > 0)
                {
                    rng.GetBytes(uintBuffer);
                    uint num = BitConverter.ToUInt32(uintBuffer, 0);
                    res.Append(valid[(int)(num % (uint)valid.Length)]);
                }
            }

            return res.ToString();
        }


        public static string EncodeBase64(string string_) {

            byte[] encodedBytes = System.Text.Encoding.UTF8.GetBytes(string_);
            string encodedString = Convert.ToBase64String(encodedBytes);

            return encodedString;
        }


        public static string DecodeBase64(string stringBase64)
        {

            byte[] decodedBytes = Convert.FromBase64String(Convert.ToBase64String(System.Text.Encoding.Unicode.GetBytes(stringBase64)));
            string decodedString = System.Text.Encoding.UTF8.GetString(decodedBytes);

            return decodedString;
        }

        public static string RandomPassword()
        {
            // Longitud de 8 
            string password = RandomString(8);

            string randomPass = EncodeBase64(password);

            return randomPass;
        }

    }

}
