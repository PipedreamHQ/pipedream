default:
	make -j2 server delayed-open

server:
	cd ../.. && python -m http.server

delayed-open:
	sleep 1 && xdg-open http://localhost:8000/examples/browser/index.html
