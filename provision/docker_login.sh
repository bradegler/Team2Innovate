#!/bin/sh

. oci_env

echo "docker login iad.ocir.io -u ${OCI_REGISTRY_USER} -p ${OCI_REGISTRY_KEY}";
docker login iad.ocir.io -u ${OCI_REGISTRY_USER} -p ${OCI_REGISTRY_KEY};
