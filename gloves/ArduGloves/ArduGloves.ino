int led1 = 5;
int led2 = 6;
int sensor1 = 11;
int sensor2 = 10;

void setup() {
  pinMode(sensor1, INPUT);
  pinMode(sensor2, INPUT);
    Serial.begin(9600);
}

void loop() {
  if (digitalRead(sensor1));
  int sensorValue1 = digitalRead(sensor1); 
  int sensorValue2 = digitalRead(sensor2); 
    Serial.println(sensorValue1+sensorValue2*2);
    delay(100);
}
