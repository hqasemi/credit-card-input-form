BuildUI:
	cd ui && yarn build

RunUIDev:
	cd ui && yarn

RunUIProduction:
	yarn global add serve
	cd ui && serve -s build

RunServer:
	node backend/websocket_server.js