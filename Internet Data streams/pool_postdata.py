import requests
import json
import time
import datetime
from twilio.rest import TwilioRestClient
import serial

port = serial.Serial("COM3", 9600, timeout = 10.0)
time.sleep(3)

def post_weather_data_to_stream( temp):
    id="bG7X9lL2wWFg09n5yJRv"
    key="VpVlDoPZzGurJeWD6wRA"
    url="https://data.sparkfun.com/input/bG7X9lL2wWFg09n5yJRv?private_key=VpVlDoPZzGurJeWD6wRA&temp=%f"
    #collection_time = str(datetime.datetime.now())
    #kentid = "sbollu"
    if temp < 25 :
        twilol()
    if temp > 28 :
        twiloh()
    response = requests.get(url % ( temp))
    print(response.status_code)

def twilol():
 # the following line needs your Twilio Account SID and Auth Token
  client = TwilioRestClient("AC35907806864b07a56f177f47239318a3", "bf1dc24e72ff1de796c9c39a32c26898")

 # change the "from_" number to your Twilio number and the "to" number
 # to the phone number you signed up for Twilio with, or upgrade your
 # account to send SMS to any phone number
  client.messages.create(to="+12347169723", from_="+16508256580", body="Pooltemperature is less than 25 degress celsius")
def twiloh():
 # the following line needs your Twilio Account SID and Auth Token
  client = TwilioRestClient("AC35907806864b07a56f177f47239318a3", "bf1dc24e72ff1de796c9c39a32c26898")

 # change the "from_" number to your Twilio number and the "to" number
 # to the phone number you signed up for Twilio with, or upgrade your
 # account to send SMS to any phone number
  client.messages.create(to="+12347169723", from_="+16508256580", body="Pooltemperature is greater than 28 degress celsius")
def get_sensor_data(port):
  # port.write('utf-8')
   x = port.readline()
   # print(str(x,"utf-8"))
   x = json.loads(str(x,"utf-8"))
   return x

if __name__ == "__main__":
    for minute in range(120):
        x = get_sensor_data(port)
        print(x)
        post_weather_data_to_stream( x['temp'])
        time.sleep(60)
        print("complete")
    port.close()
