from websocket_server import WebsocketServer
from threading import Thread, Lock
import time
import json


class TelemetryServer:
	
    def __init__(self, port: int, host: str = '0.0.0.0', tx_rate_hz: int = 10) -> None:
        self._server = WebsocketServer(host=host, port=port)
        self._clients = dict()
        self._tx_rate_hz = tx_rate_hz
        self._telemetry = {}
        self._telemetry_lock = Lock()

    def start(self) -> None:
        print(f'Opening telemetry server on {self._server.host}:{self._server.port}')
        self._server.set_fn_new_client(self._on_new_client)
        self._server.set_fn_client_left(self._on_client_left)
        self._server.set_fn_message_received(self._on_message_received)
        Thread(target=self._tx_thread, name='Telemetry TX', daemon=True).start()
        self._server.run_forever()

    def set_telemetry(self, telemetry: dict) -> None:
        with self._telemetry_lock:
            self._telemetry = telemetry

    def get_telemetry(self) -> dict:
        with self._telemetry_lock:
            return self._telemetry.copy()

    def _tx_thread(self) -> None:
        next_tx = time.time()
        period_delay = 1.0 / self._tx_rate_hz
        while True:
            next_tx += period_delay
            
            data = json.dumps(self.get_telemetry())
            self._server.send_message_to_all(data)

            time_left = next_tx - time.time()
            if time_left > 0:
                time.sleep(time_left)

    def _on_new_client(self, client: dict, server) -> None:
        self._clients[client['id']] = client
        print("New client connected and was given id %d" % client['id'])
        self._server.send_message_to_all("Hey all, a new client has joined us")

    def _on_client_left(self, client: dict, server):
        if client is not None:
            self._clients.pop(client['id'])
        print("Client(%d) disconnected" % client['id'])

    def _on_message_received(self, client: dict, server, message):
        if len(message) > 200:
            message = message[:200]+'..'
        print("Client(%d) said: %s" % (client['id'], message))


if __name__ == '__main__':
    s = TelemetryServer(8989)
    s.set_telemetry({'test': 123})
    s.start()