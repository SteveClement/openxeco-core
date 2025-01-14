![logo](./static/cyberlux-logo.jpg?raw=true "CYBERSECURITY Luxembourg")

<table>
<tr>
  <td>API checks</td>
</tr>
<tr>
  <td>Container builder</td>
  <td><a href="https://github.com/CybersecurityLuxembourg/openxeco/actions/workflows/oxe-api_docker.yml"><img src="https://github.com/CybersecurityLuxembourg/openxeco/actions/workflows/oxe-api_docker.yml/badge.svg" /></a></td>
</tr>
<tr>
  <td>Bandit Workflow</td>
  <td><a href="https://github.com/CybersecurityLuxembourg/openxeco/actions/workflows/oxe-api_pycqa-bandit.yml"><img src="https://github.com/CybersecurityLuxembourg/openxeco/actions/workflows/oxe-api_pycqa-bandit.yml/badge.svg" /></a></td>
</tr>
<tr>
  <td>Prospector Workflow</td>
  <td><a href="https://github.com/CybersecurityLuxembourg/openxeco/actions/workflows/oxe-api_pycqa-prospector.yml"><img src="https://github.com/CybersecurityLuxembourg/openxeco/actions/workflows/oxe-api_pycqa-prospector.yml/badge.svg" /></a></td>
</tr>
</table>

<table>
<tr>
  <td>Admin web</td>
</tr>
<tr>
  <td>Package builder</td>
  <td><a href="https://github.com/CybersecurityLuxembourg/openxeco/actions/workflows/oxe-web-admin_package.yml"><img src="https://github.com/CybersecurityLuxembourg/openxeco/actions/workflows/oxe-web-admin_package.yml/badge.svg" /></a></td>
</tr>
</table>

<table>
<tr>
  <td>Community web</td>
</tr>
<tr>
  <td>Package builder</td>
  <td><a href="https://github.com/CybersecurityLuxembourg/openxeco/actions/workflows/oxe-web-community_package.yml"><img src="https://github.com/CybersecurityLuxembourg/openxeco/actions/workflows/oxe-web-community_package.yml/badge.svg" /></a></td>
</tr>
</table>

<table>
<tr>
  <td>Social networks</td>
</tr>
<tr>
  <td>Twitter</td>
  <td><a href="https://twitter.com/cyberluxembourg"><img src="https://img.shields.io/twitter/follow/cyberluxembourg.svg?style=social&label=Follow" /></a></td>
</tr>
</table>

# Set up an instance

## For development

To set up the dev environment, please see those sub-project README files:

- [oxe-api/README.md](oxe-api/README.md)
- [oxe-web-admin/README.md](oxe-web-admin/README.md)
- [oxe-web-community/README.md](oxe-web-community/README.md)

## For testers

If you want to set up a local instance to test the project, please follow these instructions:

### Install docker

[Get Docker](https://docs.docker.com/get-docker/)

Linux:

```
$ sudo mkdir -p /etc/apt/keyrings/
$ curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
$ echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
$ sudo apt update && sudo apt install docker-ce docker-ce-cli containerd.io docker-compose-plugin
$ sudo adduser <your-oxe-user> docker
$ newgrp docker
# If you want to verify your docker install run: docker run hello-world
```

### Install and run the openXeco containers and its dependencies

```
$ docker network create openxeco
$ docker run -d \
    --network openxeco \
    --network-alias mariadb \
    -p 3306:3306 \
    -e MARIADB_ROOT_PASSWORD=E4syPass \
    mariadb:10.7.3
$ docker run -d -p 1025:25 b2ck/fake-smtpd
$ docker build \
    -f openxeco-core-oxe-web-admin-v1.10.1/Dockerfile \
    -t oxe-web-admin-v1.10.1 \
    --build-arg TARGET_DIR=openxeco-core-oxe-web-admin-v1.10.1 \
    https://github.com/CybersecurityLuxembourg/openxeco-core/releases/download/v1.10.1/openxeco-core-oxe-web-admin-v1.10.1.tar.gz
$ docker run -d -p 3000:3000 oxe-web-admin-v1.10.1
$ docker build \
    -f openxeco-core-oxe-web-community-v1.10.1/Dockerfile \
    -t oxe-web-community-v1.10.1 \
    --build-arg TARGET_DIR=openxeco-core-oxe-web-community-v1.10.1 \
    https://github.com/CybersecurityLuxembourg/openxeco-core/releases/download/v1.10.1/openxeco-core-oxe-web-community-v1.10.1.tar.gz
$ docker run -p 3001:3001 oxe-web-community-v1.10.1
$ docker run -d -p 5000:5000 \
    --network openxeco \
    -e ENVIRONMENT=prod \
    -e JWT_SECRET_KEY=my_secret_developer_key \
    -e DB_HOSTNAME=mariadb \
    -e DB_PORT=3306 \
    -e DB_NAME=OPENXECO \
    -e DB_USERNAME=root \
    -e DB_PASSWORD=E4syPass \
    -e MAIL_SERVER=127.0.0.1 \
    -e MAIL_PORT=1025 \
    -e MAIL_USE_TLS=False \
    -e MAIL_USE_SSL=False \
    -e MAIL_DEFAULT_SENDER=my-default-sender@example.org \
    -e IMAGE_FOLDER=/image_folder \
    -e DOCUMENT_FOLDER=/document_folder \
    -e INITIAL_ADMIN_EMAIL=my-default-admin@example.org \
    ghcr.io/cybersecurityluxembourg/openxeco-core-oxe-api:v1.10.1
```

### Enjoy the solution

Access the administrator interface:
- http://localhost:3000

Access the community interface:
- http://localhost:3001

An initial account is created with the following email: my-default-admin@example.org

Please, process to the password resetting to define your admin account password. A mocked email with the password resetting URL with be available. You can consult it via the logs of the "b2ck/fake-smtpd" container you have created previously.

## For production server

To set up the production instance, please see this file:

- [doc/INSTALL_SERVER.md](doc/INSTALL_SERVER.md)
