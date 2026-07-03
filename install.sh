#!/bin/bash

set -e

detect_version() {
    local version="${DOKPLOY_VERSION}"

    if [ -z "$version" ]; then
        version=$(curl -fsSL -o /dev/null -w '%{url_effective}\n' \
            https://github.com/dokploy/dokploy/releases/latest 2>/dev/null | \
            sed 's#.*/tag/##')

        if [ -z "$version" ]; then
            version="latest"
        fi
    fi

    echo "$version"
}

is_proxmox_lxc() {
    [ "$container" = "lxc" ] && return 0
    grep -q "container=lxc" /proc/1/environ 2>/dev/null && return 0
    return 1
}

generate_random_password() {
    if command -v openssl >/dev/null 2>&1; then
        openssl rand -base64 32 | tr -d "=+/" | cut -c1-32
    else
        tr -dc 'A-Za-z0-9' < /dev/urandom | head -c 32
    fi
}

install_dokploy() {
    VERSION_TAG=$(detect_version)
    DOCKER_IMAGE="dokploy/dokploy:${VERSION_TAG}"

    [ "$(id -u)" -eq 0 ] || exit 1

    [ "$(uname)" != "Darwin" ] || exit 1
    [ ! -f /.dockerenv ] || exit 1

    ss -tulnp | grep ':3000 ' >/dev/null && exit 1

    if ! command -v docker >/dev/null 2>&1; then
        curl -fsSL https://get.docker.com | sh -s -- --version 28.5.0
    fi

    endpoint_mode=""
    is_proxmox_lxc && endpoint_mode="--endpoint-mode dnsrr"

    docker swarm leave --force >/dev/null 2>&1 || true

    get_ip() {
        curl -4s https://ifconfig.io 2>/dev/null || \
        curl -4s https://icanhazip.com 2>/dev/null || \
        curl -6s https://ifconfig.io 2>/dev/null || true
    }

    ADVERTISE_ADDR="${ADVERTISE_ADDR:-$(hostname -I | awk '{print $1}')}"
    [ -n "$ADVERTISE_ADDR" ] || exit 1

    docker swarm init --advertise-addr "$ADVERTISE_ADDR"

    docker network rm -f dokploy-network >/dev/null 2>&1 || true
    docker network create --driver overlay --attachable dokploy-network

    # IMPORTANT FIX: external writable directory
    DOKPLOY_DIR="/opt/dokploy"
    mkdir -p "$DOKPLOY_DIR"
    chmod 755 "$DOKPLOY_DIR"

    POSTGRES_PASSWORD=$(generate_random_password)
    AUTH_SECRET=$(openssl rand -hex 32)

    echo "$POSTGRES_PASSWORD" | docker secret create dokploy_postgres_password - >/dev/null 2>&1 || true
    echo "$AUTH_SECRET" | docker secret create dokploy_auth_secret - >/dev/null 2>&1 || true

    docker service create \
        --name dokploy-postgres \
        --network dokploy-network \
        --constraint 'node.role==manager' \
        --secret source=dokploy_postgres_password,target=/run/secrets/postgres_password \
        -e POSTGRES_USER=dokploy \
        -e POSTGRES_DB=dokploy \
        -e POSTGRES_PASSWORD_FILE=/run/secrets/postgres_password \
        postgres:16

    docker service create \
        --name dokploy-redis \
        --network dokploy-network \
        --constraint 'node.role==manager' \
        redis:7

    docker service create \
        --name dokploy \
        --replicas 1 \
        --network dokploy-network \
        --constraint 'node.role==manager' \
        --mount type=bind,source=/var/run/docker.sock,target=/var/run/docker.sock \
        --mount type=bind,source=$DOKPLOY_DIR,target=/etc/dokploy \
        --mount type=volume,source=dokploy,target=/root/.docker \
        --secret source=dokploy_postgres_password,target=/run/secrets/postgres_password \
        --secret source=dokploy_auth_secret,target=/run/secrets/dokploy_auth_secret \
        -p 3000:3000 \
        -e ADVERTISE_ADDR="$ADVERTISE_ADDR" \
        -e POSTGRES_PASSWORD_FILE=/run/secrets/postgres_password \
        -e BETTER_AUTH_SECRET_FILE=/run/secrets/dokploy_auth_secret \
        "$DOCKER_IMAGE"

    mkdir -p "$DOKPLOY_DIR/traefik/dynamic"

    docker run -d \
        --name dokploy-traefik \
        --restart always \
        -v "$DOKPLOY_DIR/traefik/traefik.yml:/etc/traefik/traefik.yml" \
        -v "$DOKPLOY_DIR/traefik/dynamic:/etc/dokploy/traefik/dynamic" \
        -v /var/run/docker.sock:/var/run/docker.sock:ro \
        -p 80:80 \
        -p 443:443 \
        traefik:v3.6.7

    docker network connect dokploy-network dokploy-traefik || true

    echo "OK"
    echo "http://$ADVERTISE_ADDR:3000"
}

if [ "$1" = "update" ]; then
    docker service update --image dokploy/dokploy:$(detect_version) dokploy
else
    install_dokploy
fi
