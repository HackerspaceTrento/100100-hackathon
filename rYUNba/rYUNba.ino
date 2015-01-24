//Sensors
#include <SFE_BMP180.h>
#include <Adafruit_BMP085.h>
#include <Wire.h>
const int audio_samples = 100;
int audio_counter = 0;
int sound_array[audio_samples];
const int LS = A0;
//SFE_BMP180 pressure;
//#define ALTITUDE 150.0
Adafruit_BMP085 bmp;



//Yun
#include <Process.h>
Process nodejs;    // make a new Process for calling Node
Process video;    // make a new Process for calling Node


//Roomba
#include <SoftwareSerial.h>


int rxPin_nss = 10; //special pin for Yun
int txPin_nss = 4;

int ddPin = 5;  // pin needed for waking Rommba up

SoftwareSerial sciSerial(rxPin_nss, txPin_nss);

uint8_t stopvar = 0x00;
long lastSensing = 0;

char buf[20];


void setup() {
  // put your setup code here, to run once:


  Serial.begin(9600);
  Serial.println("On...");

  delay(1000);

  pinMode(ddPin,  OUTPUT);   // sets the pins as output
  sciSerial.begin(19200); //talking to Roomba over 19200, remember to set Roomba to 19200


  // set up ROI to receive commands
  sciSerial.write(128);  // START
  delay(50);
  sciSerial.write(130);  // CONTROL
  delay(50);



  //Sensors:
  if (!bmp.begin()) {
    Serial.println("BMP180 init fail\n\n");
  }

  Serial.println("checking roomba now");
  goForward();
  delay(2000);
  stopMoving();
  delay(500);
  goBackward();
  delay(2000);
  stopMoving();
  delay(800);
  spinLeft();
  delay(1000);
  stopMoving();
  spinRight();
  delay(1000);
  stopMoving();

  Serial.println("done Roomba initial test!");


  //OK do Yun stuff now:
  Bridge.begin(); // Initialize the Bridge

  // launch the video server script asynchronously:
  video.runShellCommandAsynchronously("/mnt/sda1/arduino/bin/captureVideo.sh");
  Serial.println("Started video process");

  // launch the ws client script asynchronously:
  nodejs.runShellCommandAsynchronously("node /mnt/sda1/arduino/node/wsclient2.js");
  Serial.println("Started ws process");

  goForward();
  delay(1000);
  stopMoving();
  delay(500);
  goBackward();
  delay(1000);
  stopMoving();
}

void loop() {
  // pass any incoming data from the running node process
  while (nodejs.available()) {
    int cmd = (int)nodejs.read();
    checkCommand(cmd - 48);
  }

  //sensor reading
  if (audio_counter == audio_samples) {
    audio_counter = 0;
  } else {
    sound_array[audio_counter] = analogRead(A1);
    audio_counter++;
  }
  if ((millis() - lastSensing) > 10000) {
    /*
    Serial.print(readLS());
    Serial.print("   ");
    Serial.print(readP());
    Serial.print("   ");
    Serial.print(readT());
    Serial.print("   ");
    Serial.println(returnSound());
    */

    //make string
    /*
    sprintf(buf, "%d, %d, %f, %d", readLS(), bmp.readPressure(), bmp.readTemperature(), returnSound());

    //send to Linux
    if (nodejs.running()) {
      String str = String(buf);
      nodejs.println(str);
    }
    */
    
    if (nodejs.running()) {
      nodejs.print(readLS());
      nodejs.print(", ");
      nodejs.print(bmp.readPressure());
      nodejs.print(", ");
      nodejs.print(bmp.readTemperature());
      nodejs.print(", ");
      nodejs.println(returnSound());
    }

    lastSensing = millis();
  }

}


int readLS() {
  return analogRead(A0);
}


int returnSound() {
  int sum = 0;
  for (int a = 0; a < audio_samples; a++) {
    sum = sum + sound_array[a];
  }
  return sum / audio_samples;
}


void checkCommand(int comm) {
  switch (comm) {
    case 1:
      roombaPowerOn();
      break;
    case 2:
      goForward();
      delay(1000);
      stopMoving();
      break;
    case 3:
      spinRight();
      delay(1000);
      stopMoving();
      break;
    case 4:
      spinLeft();
      delay(1000);
      stopMoving();
      break;
    case 5:
      goBackward();
      delay(1000);
      stopMoving();
      break;
    case 0:
      stopMoving();
      break;

    case 10:
      roombaClean();
      break;

  }
}

void goForward() {
  sciSerial.write(137);   // DRIVE
  sciSerial.write((uint8_t)0x00);   // 0x00c8 == 200
  sciSerial.write((uint8_t)0xc8);
  sciSerial.write((uint8_t)0x80);
  sciSerial.write((uint8_t)0x00);
}
void goBackward() {
  sciSerial.write(137);   // DRIVE
  sciSerial.write((uint8_t)0xff);   // 0xff38 == -200
  sciSerial.write((uint8_t)0x38);
  sciSerial.write((uint8_t)0x80);
  sciSerial.write((uint8_t)0x00);
}
void spinLeft() {
  sciSerial.write(137);   // DRIVE
  sciSerial.print(0x00);   // 0x00c8 == 200
  sciSerial.print(0xc8);
  sciSerial.print(0x00);
  sciSerial.print(0x01);   // 0x0001 == spin left
}
void spinRight() {
  sciSerial.write(137);   // DRIVE
  sciSerial.print(0x00);   // 0x00c8 == 200
  sciSerial.print(0xc8);
  sciSerial.print(0xff);
  sciSerial.print(0xff);   // 0xffff == -1 == spin right
}
void stopMoving() {
  sciSerial.write(137);   // DRIVE
  sciSerial.write(stopvar);   // 0x0000 == 0
  sciSerial.write(stopvar);
  sciSerial.write(stopvar);
  sciSerial.write(stopvar);   // 0x0000
}

void roombaPowerOn() {
  digitalWrite(ddPin, HIGH);
  delay(100);
  digitalWrite(ddPin, LOW);
  delay(500);
  digitalWrite(ddPin, HIGH);
}

void roombaClean() {
  sciSerial.write(135);
  delay(50);
}

