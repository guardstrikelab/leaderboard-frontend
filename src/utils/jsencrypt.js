import JSEncrypt from "jsencrypt/bin/jsencrypt.min";

// 密钥对生成 http://web.chacuo.net/netrsakeypair

const publicKey =
  "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC8sSV5EDqHfOhNPRy0KND6HiEc\n" +
  "q1LwpYxTKBUHfXb43XVaMn2ySbgOCiMrTtuH0nAfhQ/LuKhxiFnEKEfjTHIHPVG6\n" +
  "A+Ucaj4Ywm/OIogA1owvxr39zNgP/E52e06RVXm9Kubjj/J1Ik593Kj53XxrX4ss\n" +
  "oatyw7rUIvl60f+VPQIDAQAB";

const privateKey =
  "MIICdgIBADANBgkqhkiG9w0BAQEFAASCAmAwggJcAgEAAoGBALyxJXkQOod86E09\n" +
  "HLQo0PoeIRyrUvCljFMoFQd9dvjddVoyfbJJuA4KIytO24fScB+FD8u4qHGIWcQo\n" +
  "R+NMcgc9UboD5RxqPhjCb84iiADWjC/Gvf3M2A/8TnZ7TpFVeb0q5uOP8nUiTn3c\n" +
  "qPndfGtfiyyhq3LDutQi+XrR/5U9AgMBAAECgYBq8Zvjeacyk0C2RiS2l0uZ9umd\n" +
  "bhyb97gIiXchv6Jmel3AuU00d0Ox8VztdsxFtqeFtcy2EfqmHjmCS7IyyWj2Zw8W\n" +
  "B3ZdxHPXG0cWC3XaAuRTfR8ftkNt4ECz7BCN0JzftxE2kNxT8EmLc7igmu100XA+\n" +
  "q70vbhrMYH3E92ngAQJBAPL3BPVSvFdaGp/O/2eiXvnedzP79FTtY5rafxBBXTiU\n" +
  "Xmqp1zKQyhLjwk8Ln+PjN1FggpKa/gKOtFRX8M4OcwECQQDG0LhR6yohb4TzY25j\n" +
  "ena9bXFTm70fPDEuBSr+SoCwlr4qXs7tmW78BrBS+eVyTmJu13ZQJ3s88GTe78uz\n" +
  "5C49AkAlMvDNZrdzYFZHNXghM9j6xLbXfLHx9s6TPPTLVlahfQXfqtVJ5qUpszli\n" +
  "xNLcH0Ou7+nN7HELjzHI4BX8VnYBAkBc6s1KE9MT30/OhEjiGykFbPHK9n1T7Mi7\n" +
  "TlUClYVBgqILoVWqe8v/44xiq0INww6D6RT1bw5Ms7kg7AdS4rCtAkEA0rGsJ4q1\n" +
  "QnG44BLFKJUPsPRNCvIozOmeCBVqipNL3Krk3G+TxX8qhzAnTp07Vx64vTL09ka0\n" +
  "9HLCE2ZsxYsXBw==";

// 加密
export function encrypt(txt) {
  const encryptor = new JSEncrypt();
  encryptor.setPublicKey(publicKey); // 设置公钥
  return encryptor.encrypt(txt); // 对数据进行加密
}

// 解密
export function decrypt(txt) {
  const encryptor = new JSEncrypt();
  encryptor.setPrivateKey(privateKey); // 设置私钥
  return encryptor.decrypt(txt); // 对数据进行解密
}
