BuildUI:
	cd ui && yarn install && yarn build

RunUIDev:
	cd ui && yarn

RunUIProduction:
	yarn global add serve
	cd ui && serve -s build

RunServer:
	node server.js