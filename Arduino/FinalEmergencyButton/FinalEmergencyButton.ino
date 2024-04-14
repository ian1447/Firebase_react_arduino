#include <ESP8266WiFi.h>
#include <FirebaseArduino.h>
#include <TinyGPS++.h>
#include <SoftwareSerial.h>

static const uint32_t GPSBaud = 9600;
TinyGPSPlus gps;
SoftwareSerial SerialGPS(4, 5);

#define REDLED 15
#define GREENLED 0
const int BUTTON_PIN_SEND = 13;
const int BUTTON_PIN_FIRE = 12;
const int BUTTON_PIN_ACCIDENT = 10;
const int BUTTON_PIN_INTRUDER = 2;
int emergency = 0;
int send_button_state = 1;  //mu send ug 0
int prev_send_button_state = 1;
int long_press_prev_send_button_state = 1;
int reset = 0;
const char *ssid = "firebase";
const char *pass = "passworld";
#define FIREBASE_HOST "accessibleemergencybutton-default-rtdb.asia-southeast1.firebasedatabase.app"
#define FIREBASE_AUTH "lgvtahtMwpMDDUY5mB8tmw463inn6tFD3IAG04Jb"

float Latitude, Longitude;
int year, month, date, hour, minute, second, counter_secs, sec;
String DateString, TimeString, LatitudeString, LongitudeString;
String RecievedStr = "";

void readEmergency() {
  int button_fire = digitalRead(BUTTON_PIN_FIRE);
  if (button_fire == 0) {
    emergency = 1;
    digitalWrite(GREENLED, HIGH);
  }
  int button_accident = digitalRead(BUTTON_PIN_ACCIDENT);
  if (button_accident == 0) {
    emergency = 2;
    digitalWrite(GREENLED, HIGH);
  }
  int button_intruder = digitalRead(BUTTON_PIN_INTRUDER);
  if (button_intruder == 0) {
    emergency = 3;
    digitalWrite(GREENLED, HIGH);
  }
  // Serial.print("Emergency: ");
  // Serial.println(emergency);
}

void setup() {
  Serial.begin(9600);
  pinMode(REDLED, OUTPUT);
  pinMode(GREENLED, OUTPUT);
  pinMode(BUTTON_PIN_SEND, INPUT_PULLUP);
  pinMode(BUTTON_PIN_FIRE, INPUT_PULLUP);
  pinMode(BUTTON_PIN_ACCIDENT, INPUT_PULLUP);
  pinMode(BUTTON_PIN_INTRUDER, INPUT_PULLUP);
  SerialGPS.begin(9600);
  delay(10);

  Serial.println("Connecting to ");
  Serial.println(ssid);

  WiFi.begin(ssid, pass);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.println("WiFi connected");

  Firebase.begin(FIREBASE_HOST, FIREBASE_AUTH);
  Serial.println("Connecting to GPS");
  // while (SerialGPS.available() > 0) {
  //   delay(50);
  //   Serial.print(".");
  // }
}

void loop() {
  if (emergency == 0 && send_button_state == 1) {
    digitalWrite(GREENLED, LOW);
    digitalWrite(REDLED, LOW);
    readEmergency();
  } else if (emergency != 0 && send_button_state == 1) {
    if (counter_secs != 5) {  // mao n ang seconds before mu send para mu reset
      readEmergency();
      delay(1000);
      counter_secs += 1;
      int button_state = digitalRead(BUTTON_PIN_SEND);
      if (send_button_state != 0) {
        if (prev_send_button_state == 0 && button_state == 0) {
          digitalWrite(GREENLED, LOW);
          long_press_prev_send_button_state = button_state;
          Serial.print("First Press: ");
          Serial.println(long_press_prev_send_button_state);
          delay(2000);
          int button_state = digitalRead(BUTTON_PIN_SEND);
          if (long_press_prev_send_button_state == 0 && prev_send_button_state == 0 && button_state == 0) {
            Serial.print("Long Press: ");
            Serial.println(button_state);
            send_button_state = 0;
            counter_secs = 5;
          }
        } else {
          send_button_state = 1;
          prev_send_button_state = button_state;
        }
      }
    } else {
      counter_secs = 0;
      emergency = 0;
      sec = 0;
    }
    // if (reset = 1) {
    //   emergency = 0;
    //   reset = 0;
    // }
  } else if (emergency != 0 && send_button_state == 0) {
    reset = 1;
    digitalWrite(GREENLED, LOW);
    digitalWrite(REDLED, HIGH);
    while (SerialGPS.available() > 0) {
      // byte gpsData = SerialGPS.read();
      // Serial.write(gpsData);
      gps.encode(SerialGPS.read());
      Serial.println(gps.location.isUpdated());
      if (gps.location.isUpdated()) {
        //digitalWrite(GREENLED, HIGH);
        Serial.print("Latitude= ");
        Serial.print(gps.location.lat(), 6);
        Serial.print(" Longitude= ");
        Serial.println(gps.location.lng(), 6);
        if (emergency == 1) {
          Firebase.setString("data/nature_of_emergency", "Fire");
        } else if (emergency == 2) {
          Firebase.setString("data/nature_of_emergency", "Accident");
        } else if (emergency == 3) {
          Firebase.setString("data/nature_of_emergency", "Intruder");
        }
        Firebase.setString("data/Lat", String(gps.location.lat(), 6));
        Firebase.setString("data/Long", String(gps.location.lng(), 6));
        Firebase.setString("data/sender", "1");
        if (Firebase.failed()) {
          Serial.println("Firebase sending failed...");
          Serial.println(Firebase.error());
        }
        delay(30000);  // delay before maka send balik ang device
        emergency = 0;
        send_button_state = 1;
        return;
      }
    }
  }
}