#!/bin/sh

. oci_env

kubectl create secret docker-registry ocir --docker-server=iad.ocir.io --docker-username="${OCI_REGISTRY_USER}" --docker-password="${OCI_REGISTRY_KEY}" --docker-email="${OCI_REGISTRY_EMAIL}"
