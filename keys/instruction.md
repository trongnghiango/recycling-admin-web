# Add in this directory your RSA Keys (You can generate these keys online also)

1. private.pem
2. public.pem

Example files are provided in the directory
This procedure explains how to generate a pair of RSA keys that you can use to sign and verify JWTs.

Create a private RSA keys that are between 1024 and 4096 bits long. You have a jwtRSA256-private.pem private key in PEM format.

```shell
openssl genrsa -out jwtRSA256-private.pem 2048
```

Don't add a passphrase.

Extract a public key from the private key.

```shell
openssl rsa -in jwtRSA256-private.pem -pubout -outform PEM -out jwtRSA256-public.pem
```
