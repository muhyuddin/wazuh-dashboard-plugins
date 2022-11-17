# Wazuh Stack 4.3.x

On this folder, we can find two types of environments:

 * release environment, managed by the `rel.sh` script
 * prerelease environment managed by the `pre.sh` script

###  UI Credentials

The default user and password to access the UI at https://0.0.0.0:5601/ are:

```
admin:SecretPassword
```

## Release environment

This environment will start a working deployment with:
  - Wazuh Manager
  - Wazuh Indexer
  - Wazuh Dashboard

Check the scripts for a list of the supported Wazuh versions.

The environment expect the network `mon` to exists, either bring up the
`mon` stack or execute the following command:

```bash
docker network create mon
```

The images used here are generated by the CI/CD team and uploaded into
the official Docker Hub organization. No Wazuh Agent image is provided yet,
so you'll need to deploy an agent in Docker manually, by following the 
instructions below.

### Image certificates

Certificates are created automatically by the docker-compose, but if
it fails to create them with the appropriate permissions, we might need
to adjust them.

This is related to the way the official Wazuh docker images are
prepared.

### Registering agents using Docker

To register an agent, we need to get the enrollment command from the
UI and then execute:

- For `CentOS/8` images:
  ```bash
  docker run --name wz-rel-agent-4.3.8 --rm --network wz-rel-438 -d centos:8 bash -c '
    sed -i -e "s|mirrorlist=|#mirrorlist=|g" /etc/yum.repos.d/CentOS-*
    sed -i -e "s|#baseurl=http://mirror.centos.org|baseurl=http://vault.centos.org|g" /etc/yum.repos.d/CentOS-*

    # Change this command by the one the UI suggests. Add the -y flag and remove the `sudo`.
    WAZUH_MANAGER='wazuh.manager' yum install -y https://packages.wazuh.com/4.x/yum5/x86_64/wazuh-agent-4.3.8-1.el5.x86_64.rpm

    /etc/init.d/wazuh-agent start
    tail -f /var/ossec/logs/ossec.log
  '
  ```

- For `Ubuntu` images
  ```bash
  docker run --name wz-rel-agent-4.3.8 --network wz-rel-438 --label com.docker.compose.project=wz-rel-438 -d ubuntu:20.04 bash -c '
    apt update -y
    apt install -y curl lsb-release

    # Change this command by the one the UI suggests to use. Remove the `sudo`.
    curl -so wazuh-agent-4.3.8.deb https://packages.wazuh.com/4.x/apt/pool/main/w/wazuh-agent/wazuh-agent_4.3.8-1_amd64.deb && WAZUH_MANAGER='wazuh.manager' WAZUH_AGENT_GROUP='default' dpkg -i ./wazuh-agent-4.3.8.deb

    /etc/init.d/wazuh-agent start
    tail -f /var/ossec/logs/ossec.log
  '
  ```

- For `non-Linux` agents:
  
  We need to provision virtual machines.

## Prerelease environment

The prerelease environment helps us test app releases while the rest of
Wazuh packages haven't been generated yet.

This environment will bring up:

 - Wazuh Indexer
 - Wazuh Dashboard
 - Filebeat
 - Imposter

### Usage

The way to use this environment is to bring up a published Wazuh version to 
later on upgrade the app with our pre-release package.

While bring up the environment with the `pre.sh` script, specify the published 
version of Wazuh with the `wazuh_version` argument, the new patch version of 
Wazuh with `wazuh_api_version` and finally follow the steps provided by the 
scripts.

Example: test a package for Wazuh 4.3.9

```bash
./pre.sh 4.3.8 9 up
```

```bash
./pre.sh wazuh_version wazuh_api_version action

where
  wazuh_version is one of
  wazuh_api_version is the minor version of wazuh 4.3, for example  5 17
  action is one of up | down

In a minor release, the API should not change the version here bumps the API
 string returned for testing. This script generates the file

    config/imposter/api_info.json

used by the mock server
```

Please take into account that the API version for this environment will 
always be a 4.3.x version. Also consider that our application version 
must be the same as the one selected here.

### App upgrade

Follow the instructions provided by the `pre.sh` script. 

### Agent enrollment

Because we're not using a real Wazuh Manager, we cannot register new agents. 
Instead, Imposter (the mock server) will provide mocked responds to valid API 
requests, as if it were the real Wazuh server.