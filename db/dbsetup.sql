DROP DATABASE IF EXISTS airline_master;
CREATE DATABASE airline_master;

\c airline_master;

CREATE TABLE airlinemaster (
  airline_id varchar(10) NOT NULL,
  iatacode varchar(13) DEFAULT NULL,
  airline_name varchar(43) DEFAULT NULL,
  A varchar(15) DEFAULT NULL,
  B varchar(15) DEFAULT NULL,
  C varchar(15) DEFAULT NULL,
  D varchar(15) DEFAULT NULL,
  E varchar(15) DEFAULT NULL,
  F varchar(15) DEFAULT NULL,
  G varchar(15) DEFAULT NULL,
  H varchar(15) DEFAULT NULL,
  I varchar(15) DEFAULT NULL,
  J varchar(15) DEFAULT NULL,
  K varchar(15) DEFAULT NULL,
  L varchar(15) DEFAULT NULL,
  M varchar(15) DEFAULT NULL,
  N varchar(15) DEFAULT NULL,
  O varchar(15) DEFAULT NULL,
  P varchar(15) DEFAULT NULL,
  Q varchar(15) DEFAULT NULL,
  R varchar(15) DEFAULT NULL,
  S varchar(15) DEFAULT NULL,
  T varchar(15) DEFAULT NULL,
  U varchar(15) DEFAULT NULL,
  V varchar(15) DEFAULT NULL,
  W varchar(15) DEFAULT NULL,
  X varchar(15) DEFAULT NULL,
  Y varchar(15) DEFAULT NULL,
  Z varchar(15) DEFAULT NULL
);

--
-- Table structure for table `airportdata`
--

CREATE TABLE airportdata (
  airportid int DEFAULT NULL,
  airportname varchar(70) DEFAULT NULL,
  cityname varchar(39) DEFAULT NULL,
  countryname varchar(32) DEFAULT NULL,
  airportcode varchar(6) DEFAULT NULL,
  aiportcodefour varchar(8) DEFAULT NULL,
  latitude decimal(12,9) DEFAULT NULL,
  longitude decimal(12,9) DEFAULT NULL,
  COLone int DEFAULT NULL,
  timezonehours varchar(3) DEFAULT NULL,
  timezoneminutes int DEFAULT NULL,
  COLtwo varchar(20) DEFAULT NULL,
  timezone varchar(30) DEFAULT NULL,
  COLthree varchar(7) DEFAULT NULL,
  COLfour varchar(11) DEFAULT NULL
);