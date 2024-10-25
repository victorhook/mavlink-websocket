BUILD_DIR=build
REBUILD_SCRIPT=local_deploy.sh
TARGET_HOST=system@e3hub.local
USER_DIR=/home/system
TARGET_DIR=${USER_DIR}/react-app

echo Building react app!
npm run build

echo Deploying to ${TARGET_HOST}
rsync -av ${BUILD_DIR} ${TARGET_HOST}:${TARGET_DIR}
rsync -av ${REBUILD_SCRIPT} ${TARGET_HOST}:${USER_DIR}

ssh system@e3hub.local "./local_deploy.sh"
