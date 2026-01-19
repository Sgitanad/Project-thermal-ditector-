import os
import django
import json
from datetime import datetime

import meshtastic
import meshtastic.serial_interface
from pubsub import pub

# Django setup
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "mySite.settings")
django.setup()

from core.models import ThermalData


def on_receive(packet, interface=None):
    try:
        if "decoded" in packet and "payload" in packet["decoded"]:
            payload = packet["decoded"]["payload"].decode("utf-8")
            data = json.loads(payload)

            ThermalData.objects.create(
                temperature=data["temperature"],
                humidity=data["humidity"],
                pressure=data["pressure"],
                created_at=datetime.now()
            )

            print("Saved:", data)

    except Exception as e:
        print("Error:", e)


# Connect to Heltec (change COM port if needed)
interface = meshtastic.serial_interface.SerialInterface(devPath="COM4")

# Subscribe to Meshtastic messages
pub.subscribe(on_receive, "meshtastic.receive")

print("Listening for Meshtastic packets...")

# Keep script alive
while True:
    pass
