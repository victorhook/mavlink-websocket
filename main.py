from pymavlink import mavutil
from pymavlink.dialects.v20 import ardupilotmega
from pymavlink.dialects.v20.ardupilotmega import *
import yaml
from dataclasses import dataclass
from typing import Dict, List



@dataclass
class Config:
    target_system_id: int
    target_component_id: int
    port: int
    stream_frequency_hz: int
    data: Dict[str, dict]


class MavlinkMessageHandler:

    def __init__(self, msg_name: str, desired_fields: List[str]) -> None:
        self.msg_name = msg_name
        self.msg_id = getattr(ardupilotmega, f'MAVLINK_MSG_ID_{msg_name}')
        self.fields = {field: 0.0 for field in desired_fields}

    def handle_message(self, msg: MAVLink_message) -> None:
        for field in self.fields:
            self.fields[field] = getattr(msg, field)
        #print(self.fields)


class MavlinkServer:
    
    def __init__(self, config: Config) -> None:
        self._con: mavutil.mavudp = None
        self.config = config
        self.system_id = 250
        self.component_id = MAV_COMP_ID_USER1
        self.msg_handlers = dict()

    def start(self) -> None:
        print(f'Listening to UDP port {self.config.port}')
        self._con = mavutil.mavlink_connection(
            f'udp:127.0.0.1:{self.config.port}',
            source_system=self.system_id,
            source_component=self.component_id
        )

        print('Waiting for heartbeat...')
        self._con.wait_heartbeat()
        print(f'Heartbeat from system (system {self._con.target_system} component {self._con.target_component})')

        # Remove existing data streams
        self._request_data_streams(MAV_DATA_STREAM_ALL, 0)
        time.sleep(.25)

        # Let's build requests for data streams
        print('Requesting data streams')
        for mavlink_msg, attrs in self.config.data.items():
            rate = int(attrs.get('rate', 10))
            desired_fields = attrs.get('fields')

            msg_handler = MavlinkMessageHandler(mavlink_msg, desired_fields)
            self.msg_handlers[msg_handler.msg_id] = msg_handler
            print(f'  {mavlink_msg} at {rate} hz')
            self._request_data_streams(msg_handler.msg_id, rate)

        def go():
            import json
            while True:
                print(json.dumps(self.telemetry(), indent=4))
                time.sleep(1)


        from threading import Thread
        Thread(target=go, daemon=True).start()

        # Main loop to listen for specific MAVLink messages
        try:
            while True:
                # Receive the next MAVLink message
                msg = self._con.recv_match(blocking=True)
                if msg is not None:
                    self._handle_mavlink_messages(msg)
        except KeyboardInterrupt:
            print("Exiting...")

    def telemetry(self) -> dict:
        ''' Returns the telemetry as a dictionary. '''
        data = dict()
        for handler in self.msg_handlers.values():
            data[handler.msg_name] = handler.fields
        return data

    def _handle_mavlink_messages(self, message: MAVLink_message) -> None:
        #print(message.get_type())
        handler: MavlinkMessageHandler = self.msg_handlers.get(message.id)
        if handler is not None:
            handler.handle_message(message)

    # Function to request data streams
    def _request_data_streams(self, req_stream_id: int, rate_hz: int = 10) -> None:
        # Request attitude data stream
        self._con.mav.request_data_stream_send(
            target_system=self.config.target_system_id,
            target_component=self.config.target_component_id,
            req_stream_id=req_stream_id,
            req_message_rate=rate_hz,
            start_stop=1    # Start sending
        )


if __name__ == '__main__':
    from pymavlink import mavutil
    
    with open('./example.yaml', 'r') as file:
        config_dict = yaml.safe_load(file)
        config = Config(**config_dict)

    server = MavlinkServer(config)
    server.start()

