CREATE DATABASE  IF NOT EXISTS `gameshelf` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `gameshelf`;
-- MySQL dump 10.13  Distrib 8.0.40, for Win64 (x86_64)
--
-- Host: localhost    Database: gameshelf
-- ------------------------------------------------------
-- Server version	8.0.40

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `added`
--

DROP TABLE IF EXISTS `added`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `added` (
  `Game_ID` int NOT NULL,
  `Admin_ID` int NOT NULL,
  PRIMARY KEY (`Game_ID`,`Admin_ID`),
  KEY `can_add_ibfk_1` (`Admin_ID`),
  CONSTRAINT `added_ibfk_1` FOREIGN KEY (`Admin_ID`) REFERENCES `admin` (`Admin_ID`) ON DELETE CASCADE,
  CONSTRAINT `added_ibfk_2` FOREIGN KEY (`Game_ID`) REFERENCES `game` (`Game_ID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `added`
--

LOCK TABLES `added` WRITE;
/*!40000 ALTER TABLE `added` DISABLE KEYS */;
/*!40000 ALTER TABLE `added` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `admin`
--

DROP TABLE IF EXISTS `admin`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `admin` (
  `Admin_ID` int NOT NULL AUTO_INCREMENT,
  `Admin_password` varchar(45) NOT NULL,
  `Admin_username` varchar(20) NOT NULL,
  PRIMARY KEY (`Admin_ID`),
  CONSTRAINT `admin_chk_1` CHECK ((char_length(`Admin_password`) between 8 and 24)),
  CONSTRAINT `admin_chk_2` CHECK ((char_length(`Admin_password`) between 8 and 45)),
  CONSTRAINT `admin_chk_3` CHECK ((char_length(`Admin_password`) >= 8))
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admin`
--

LOCK TABLES `admin` WRITE;
/*!40000 ALTER TABLE `admin` DISABLE KEYS */;
INSERT INTO `admin` VALUES (1,'TestPass','TestUser');
/*!40000 ALTER TABLE `admin` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `banned`
--

DROP TABLE IF EXISTS `banned`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `banned` (
  `User_ID` int NOT NULL,
  `Admin_ID` int NOT NULL,
  PRIMARY KEY (`User_ID`,`Admin_ID`),
  KEY `can_ban_ibfk_1` (`Admin_ID`),
  CONSTRAINT `banned_ibfk_1` FOREIGN KEY (`Admin_ID`) REFERENCES `admin` (`Admin_ID`) ON DELETE CASCADE,
  CONSTRAINT `banned_ibfk_2` FOREIGN KEY (`User_ID`) REFERENCES `user` (`User_ID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `banned`
--

LOCK TABLES `banned` WRITE;
/*!40000 ALTER TABLE `banned` DISABLE KEYS */;
/*!40000 ALTER TABLE `banned` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `favorite`
--

DROP TABLE IF EXISTS `favorite`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `favorite` (
  `Game_ID` int NOT NULL,
  `User_ID` int NOT NULL,
  PRIMARY KEY (`User_ID`,`Game_ID`),
  KEY `_idx` (`Game_ID`),
  CONSTRAINT `favorite_ibfk_1` FOREIGN KEY (`User_ID`) REFERENCES `user` (`User_ID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `favorite_ibfk_2` FOREIGN KEY (`Game_ID`) REFERENCES `game` (`Game_ID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `favorite`
--

LOCK TABLES `favorite` WRITE;
/*!40000 ALTER TABLE `favorite` DISABLE KEYS */;
INSERT INTO `favorite` VALUES (2,7);
/*!40000 ALTER TABLE `favorite` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `follows`
--

DROP TABLE IF EXISTS `follows`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `follows` (
  `User_ID` int NOT NULL,
  `Followed_by_user_ID` int NOT NULL,
  PRIMARY KEY (`User_ID`,`Followed_by_user_ID`),
  KEY `follows_ibfk_2` (`Followed_by_user_ID`),
  CONSTRAINT `follows_ibfk_1` FOREIGN KEY (`User_ID`) REFERENCES `user` (`User_ID`) ON DELETE CASCADE,
  CONSTRAINT `follows_ibfk_2` FOREIGN KEY (`Followed_by_user_ID`) REFERENCES `user` (`User_ID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `follows`
--

LOCK TABLES `follows` WRITE;
/*!40000 ALTER TABLE `follows` DISABLE KEYS */;
INSERT INTO `follows` VALUES (7,4),(9,4),(4,7);
/*!40000 ALTER TABLE `follows` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `game`
--

DROP TABLE IF EXISTS `game`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `game` (
  `Game_ID` int NOT NULL AUTO_INCREMENT,
  `Title` varchar(50) NOT NULL,
  `Producer` varchar(50) NOT NULL,
  `Coverart_fp` varchar(50) DEFAULT NULL,
  `Overall_rating` decimal(3,2) NOT NULL DEFAULT '0.00',
  `Release_date` date DEFAULT NULL,
  `Studio_ID` int NOT NULL,
  `Description` varchar(1500) DEFAULT NULL,
  PRIMARY KEY (`Game_ID`),
  KEY `game_ibfk_1` (`Studio_ID`),
  CONSTRAINT `game_ibfk_1` FOREIGN KEY (`Studio_ID`) REFERENCES `game_studio` (`Studio_ID`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `game`
--

LOCK TABLES `game` WRITE;
/*!40000 ALTER TABLE `game` DISABLE KEYS */;
INSERT INTO `game` VALUES (2,'Overwatch 2','BLIZZARD ENTERTAINMENT','Overwatch2.jpg',0.00,'2022-10-04',2,'Overwatch 2 is a free-to-play, team-based action game set in the optimistic future, where every match is the ultimate 5v5 battlefield brawl. Play as a time-jumping freedom fighter, a beat-dropping battlefield DJ, or one of over 30 other unique heroes as you battle it out around the globe. It is the sequel to Overwatch.'),(12,'Stardew Valley','ConcernedApe','Stardew_Valley.jpg',0.00,'2016-02-25',3,'You\'ve inherited your grandfather\'s old farm plot in Stardew Valley. Armed with hand-me-down tools and a few coins, you set out to begin your new life. Can you learn to live off the land and turn these overgrown fields into a thriving home? It won\'t be easy. Ever since Joja Corporation came to town, the old ways of life have all but disappeared. The community center, once the town\'s most vibrant hub of activity, now lies in shambles. But the valley seems full of opportunity. With a little dedication, you might just be the one to restore Stardew Valley to greatness!'),(13,'VALORANT','Riot Games','VALORANT.jpg',0.00,'2020-06-02',4,'A free-to-play multiplayer first-person shooter video game developed by Riot Games. It is the first game Riot Games has developed in the genre. The game was first announced with the codename Project A in October 2019. It is set to be released for Microsoft Windows in the summer of 2020, with a closed beta starting on April 7, 2020. Two teams of five play against each other, players assume the role of \"agents\" with unique abilities and use an economy system to purchase their abilities and weapons. In the main game mode, the attacking team has a bomb, called the Spike, that they need to plant on a site. If the attacking team successfully protects the bomb and it detonates, they get a point. If the defending team successfully defuses the bomb, or the 100-second round timer expires, the defending team gets a point. Eliminating all opposing team members also earns a round win. The first team to win the best of 25 rounds wins the match. There are currently ten known agents in Valorant. Agents each have special abilities, that are either bought before rounds or earned throughout elimination in the game.'),(14,'Shadow of the Tomb Raider','Square Enix','Shadow_of_the_Tomb_Raider.jpg',0.00,'2018-09-14',5,'Shadow of the Tomb Raider is an action-adventure video game developed by Eidos Montréal in conjunction with Crystal Dynamics and published by Square Enix. It continues the narrative from the 2013 game Tomb Raider and its sequel Rise of the Tomb Raider, and is the twelfth mainline entry in the Tomb Raider series. Set shortly after the events of Rise of the Tomb Raider, its story follows Lara Croft as she ventures through Mesoamerica and South America to the legendary city Paititi, battling the paramilitary organization Trinity and racing to stop a Mayan apocalypse she has unleashed. Lara must traverse the environment and combat enemies with firearms and stealth as she explores semi-open hubs. In these hubs she can raid challenge tombs to unlock new rewards, complete side missions, and scavenge for resources which can be used to craft useful materials.'),(15,'Minecraft: Java Edition','Mojang Studios','Minecraft_Java_Edition.jpg',0.00,'2009-11-18',6,'Minecraft is a sandbox game developed and published by Mojang Studios for Windows. Originally created by Markus \"Notch\" Persson using the Java programming language, it was developed over the span of two years, with many public test builds being released from May 2009 until its full release on 18 November 2011. Minecraft is a game made from blocks that you can transform into whatever you can imagine. Play in Creative mode with unlimited resources, or hunt for tools to fend off danger in Survival mode. You can adventure solo or with friends, and discover an infinite, randomly generated world filled with blocks to mine, biomes to explore and mobs to befriend (or fight). The choice is yours in Minecraft – so play your way!'),(16,'BioShock','2K Games','BioShock.jpg',0.00,'2007-07-20',7,'BioShock is a shooter unlike any you\'ve ever played, loaded with weapons and tactics never seen. You\'ll have a complete arsenal at your disposal from simple revolvers to grenade launchers and chemical throwers, but you\'ll also be forced to genetically modify your DNA to create an even more deadly weapon: you.'),(17,'Dishonored','Bethesda Softworks','Dishonored.jpg',0.00,'2012-10-09',8,'Dishonored is an immersive first-person action game that casts you as a supernatural assassin driven by revenge. With Dishonored’s flexible combat system, creatively eliminate your targets as you combine the supernatural abilities, weapons and unusual gadgets at your disposal.'),(18,'Papa\'s Freezeria Deluxe','Flipline Studios','Papas_Freezeria_Deluxe.jpg',0.00,'2023-04-01',9,'Return to Calypso Island to serve seasonal sundae treats in Papa\'s Freezeria Deluxe! Craft sundaes for all your quirky customers while earning tips, points and Special Recipes. Switch gears and take a trip in the Food Truck to concoct your own chilly creations and see who shows up!'),(23,'PlateUp!',' Yogscast Games','game-1733723518873-305197965.jpg',0.00,'2022-08-04',26,'Cook and serve your dishes, design and decorate your restaurants, and expand your culinary kingdom with new unlocks, abilities and dishes in procedurally-generated locations. Classic cooking action with permanent roguelite progression. Hire your friends - or do it all yourself!'),(24,'Coffee Caravan',' Broccoli Games','game-1733735935170-533633347.webp',0.00,'2024-05-20',28,'Fuel your coffee passion in Coffee Caravan! As a cafe manager, brew, experiment with delicious recipes, and build your dream coffee business on wheels. Serve customers, unlock new flavors, purchase appliances, and enjoy your procedurally generated road trip in this roguelite experience.'),(25,'It Takes Two','Electronic Arts','game-1733736221893-547857636.jpg',0.00,'2021-03-25',29,'Embark on the craziest journey of your life in It Takes Two, a genre-bending platform adventure created purely for co-op. Invite a friend to join for free with Friend’s Pass and work together across a huge variety of gleefully disruptive gameplay challenges. Play as the clashing couple Cody and May, two humans turned into dolls by a magic spell. Together, trapped in a fantastical world where the unpredictable hides around every corner, they are reluctantly challenged with saving their fractured relationship.'),(27,'Phasmophobia','Kinetic Games','game-1733736583881-99428911.jpg',0.00,'2020-09-04',30,'Phasmophobia is a 4-player, online co-op, psychological horror game. You and your team of paranormal investigators will enter haunted locations filled with paranormal activity and try to gather as much evidence as you can. Use your ghost-hunting equipment to find and record evidence to sell on to a ghost removal team.'),(29,'THE FINALS',' Embark Studios','game-1733737061510-253192714.jpg',0.00,'2023-12-07',31,'Join THE FINALS, the world-famous, free-to-play, combat-centered game show! Fight alongside your teammates in virtual arenas that you can alter, exploit, and even destroy. Build your own playstyle in this first-person shooter to win escalating tournaments and lasting fame.'),(30,'Super Mario Land','Nintendo','game-1733775878867-846516699.png',0.00,'1989-04-21',32,'Join Mario in a world of strange creatures! Ancient ruins, giant crabs, Koopa Troopas, flying stone heads and hungry sharks await you in this brand new world of adventure. Travel over land, in the air, and underwater. Mario runs, jumps and bounces his way to fortune and glory on his mission to save Princess! A beautiful kingdom on ancient ruins, tempestuous waters, and brand new challenges makes Super Mario Land the best ever!\r\n\r\n');
/*!40000 ALTER TABLE `game` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `game_genre`
--

DROP TABLE IF EXISTS `game_genre`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `game_genre` (
  `Game_ID` int NOT NULL,
  `Genre_ID` int NOT NULL,
  PRIMARY KEY (`Game_ID`,`Genre_ID`),
  KEY `game_genre_ibfk_2` (`Genre_ID`),
  CONSTRAINT `game_genre_ibfk_1` FOREIGN KEY (`Game_ID`) REFERENCES `game` (`Game_ID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `game_genre_ibfk_2` FOREIGN KEY (`Genre_ID`) REFERENCES `genre` (`Genre_ID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `game_genre`
--

LOCK TABLES `game_genre` WRITE;
/*!40000 ALTER TABLE `game_genre` DISABLE KEYS */;
INSERT INTO `game_genre` VALUES (2,1),(13,1),(16,1),(29,1),(15,2),(23,2),(25,2),(27,2),(18,3),(23,3),(24,3),(18,4),(23,4),(24,4),(14,5),(25,5),(27,5),(14,6),(15,6),(16,6),(17,6),(25,6),(14,7),(16,7),(12,8),(2,10),(13,10),(15,10),(25,10),(29,10),(12,11),(18,12),(24,12),(14,13),(17,13),(25,13),(29,13),(30,13),(16,14),(27,14),(12,15),(27,15),(18,16),(24,16),(14,17),(15,17),(16,17),(17,17),(18,17),(24,17),(25,18),(12,19),(18,19),(14,20),(17,20),(15,21),(15,22),(14,23),(17,23);
/*!40000 ALTER TABLE `game_genre` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `game_request`
--

DROP TABLE IF EXISTS `game_request`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `game_request` (
  `Request_ID` int NOT NULL AUTO_INCREMENT,
  `Title` varchar(20) NOT NULL,
  `Developer` varchar(20) NOT NULL,
  `Source_url` varchar(45) NOT NULL,
  `User_ID` int DEFAULT NULL,
  PRIMARY KEY (`Request_ID`),
  KEY `game_request_ibfk_1` (`User_ID`),
  CONSTRAINT `game_request_ibfk_1` FOREIGN KEY (`User_ID`) REFERENCES `user` (`User_ID`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `game_request`
--

LOCK TABLES `game_request` WRITE;
/*!40000 ALTER TABLE `game_request` DISABLE KEYS */;
/*!40000 ALTER TABLE `game_request` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `game_studio`
--

DROP TABLE IF EXISTS `game_studio`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `game_studio` (
  `Studio_ID` int NOT NULL AUTO_INCREMENT,
  `Studio_icon_fp` varchar(45) DEFAULT NULL,
  `Studio_name` varchar(50) NOT NULL,
  `Num_of_games` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`Studio_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `game_studio`
--

LOCK TABLES `game_studio` WRITE;
/*!40000 ALTER TABLE `game_studio` DISABLE KEYS */;
INSERT INTO `game_studio` VALUES (2,'Blizzard_Entertainment.png','BLIZZARD ENTERTAINMENT',0),(3,'ConcernedApe.jpg','ConcernedApe',0),(4,'Riot_Games.png','Riot Games',0),(5,'Eidos-Montréal.png','Eidos-Montréal',0),(6,'Mojang_Studios.png','Mojang Studios',0),(7,'Irrational_Games.png','Irrational Games',0),(8,'Arkane_Studios.png','Arkane Studios',0),(9,'FliplineStudios.png','Flipline Studios',0),(26,NULL,' Its happening',0),(27,'studio-1733719942982-869653057.png','Valve',0),(28,'studio-1733735676597-921382732.jpg',' Broccoli Games',0),(29,'studio-1733736059718-964745710.png','Hazelight Studios',0),(30,'studio-1733736304994-870494681.png','Kinetic Games',0),(31,'studio-1733736757148-823616880.png',' Embark Studios',0),(32,'studio-1733775756856-215940329.png','Nintendo',0);
/*!40000 ALTER TABLE `game_studio` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `games_in_shelf`
--

DROP TABLE IF EXISTS `games_in_shelf`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `games_in_shelf` (
  `Shelf_ID` int NOT NULL AUTO_INCREMENT,
  `User_ID` int NOT NULL,
  `Game_ID` int NOT NULL,
  `Hours_played` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`Shelf_ID`,`User_ID`,`Game_ID`),
  KEY `FK_Game_ID_idx` (`Game_ID`),
  KEY `FK_User_ID` (`User_ID`),
  CONSTRAINT `FK_Game_ID` FOREIGN KEY (`Game_ID`) REFERENCES `game` (`Game_ID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_Shelf_ID` FOREIGN KEY (`Shelf_ID`) REFERENCES `shelf` (`Shelf_ID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_User_ID` FOREIGN KEY (`User_ID`) REFERENCES `user` (`User_ID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `games_in_shelf`
--

LOCK TABLES `games_in_shelf` WRITE;
/*!40000 ALTER TABLE `games_in_shelf` DISABLE KEYS */;
INSERT INTO `games_in_shelf` VALUES (1,4,12,0),(1,4,13,0),(1,4,14,0),(1,4,15,0),(1,4,16,0),(1,4,18,0),(2,7,13,0),(2,7,15,40);
/*!40000 ALTER TABLE `games_in_shelf` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `genre`
--

DROP TABLE IF EXISTS `genre`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `genre` (
  `Genre_ID` int NOT NULL AUTO_INCREMENT,
  `Genre_description` varchar(250) NOT NULL,
  `Genre_name` varchar(50) NOT NULL,
  PRIMARY KEY (`Genre_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `genre`
--

LOCK TABLES `genre` WRITE;
/*!40000 ALTER TABLE `genre` DISABLE KEYS */;
INSERT INTO `genre` VALUES (1,'Games where players control a character from a first-person perspective, typically engaging in combat using firearms. The focus is on fast-paced action, precise aiming, and strategic use of weapons.','First person shooter'),(2,'Players team up to complete objectives together, emphasizing coordination and shared challenges.','Co-op'),(3,'Players prepare and cook dishes by following recipes, managing ingredients, and often racing against the clock.','Cooking'),(4,'Players oversee resources, make strategic decisions, and optimize systems to achieve specific goals.','Management'),(5,'Players solve challenges that test logic, pattern recognition, and problem-solving skills.','Puzzle'),(6,'Players explore and interact with environments, combining combat, puzzles, and storytelling in a dynamic experience.','Action-Adventure Game'),(7,'Players experience a narrative-driven journey, emphasizing character development and immersive storytelling.','Story-Rich'),(8,'Players cultivate crops, raise animals, and manage a farm, balancing tasks and resources for growth.','Farming Sim'),(9,'Games featuring art styled with retro-inspired, pixelated visuals, often evoking nostalgia.','Pixel Graphics'),(10,'Players interact and compete or cooperate with others in shared game environments.','Multiplayer'),(11,'Players manage daily activities, relationships, and choices in a sandbox or structured environment.','Life Sim'),(12,'Players plan and execute tactics to achieve goals, often managing resources and commanding units.','Strategy'),(13,'Players navigate levels by jumping and overcoming obstacles, often requiring timing and precision.','Platformer'),(14,'Players face tense, resource-scarce scenarios while battling fearsome threats and managing limited resources.','Survival Horror'),(15,'Games developed by small, independent teams or individuals, often focusing on creativity and unique gameplay.','Indie'),(16,'Players replicate real-world activities or systems, focusing on realistic environments and mechanics.','Simulation'),(17,'A game designed to be played by one person, focusing on solo experiences and progression.','Singleplayer'),(18,'Players share a single screen, with each having their own section for local multiplayer gameplay.','Split Screen'),(19,'Players assume the roles of characters, often in a fictional world, making decisions that affect the story and character development.','Role-playing'),(20,'Players engage in combat using ranged weapons, typically focusing on aiming and eliminating enemies.','Shooter'),(21,'Players must manage resources, build shelter, and fend off threats to stay alive in a hostile environment.','Survival'),(22,'Players have the freedom to explore, create, and interact with an open world, often without specific goals or restrictions.','Sandbox'),(23,'Players must avoid detection while completing objectives, relying on stealth and strategy rather than direct combat.','Stealth');
/*!40000 ALTER TABLE `genre` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `platform`
--

DROP TABLE IF EXISTS `platform`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `platform` (
  `Platform_ID` int NOT NULL AUTO_INCREMENT,
  `Platform_name` varchar(20) NOT NULL,
  `Plat_icon_fp` varchar(45) NOT NULL,
  `Release_date` date NOT NULL,
  PRIMARY KEY (`Platform_ID`),
  UNIQUE KEY `Platform_name_UNIQUE` (`Platform_name`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `platform`
--

LOCK TABLES `platform` WRITE;
/*!40000 ALTER TABLE `platform` DISABLE KEYS */;
INSERT INTO `platform` VALUES (1,'macOS','macOS.png','2001-03-24'),(2,'Android','android.png','2008-09-23'),(3,'iOS','ios.png','2007-06-29'),(4,'Nintendo Switch','Nintendo_Switch.png','2017-03-03'),(5,'Playstation 4','playstation.png','2013-11-15'),(6,'Windows','windows.png','1985-11-20'),(7,'Xbox One','xbox.png','2013-11-22'),(8,'Xbox Series X','Xbox_Series_X.png','2020-11-10'),(9,'Playstation 5','playstation5.png','2020-11-12'),(10,'Xbox 360','xbox-360.png','2005-11-22'),(11,'Playstation 3','playstation3.png','2006-11-11'),(12,'Game Boy','platform-1733775526115-184704069.png','1989-04-21');
/*!40000 ALTER TABLE `platform` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `plays_on`
--

DROP TABLE IF EXISTS `plays_on`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `plays_on` (
  `Game_ID` int NOT NULL,
  `Platform_ID` int NOT NULL,
  PRIMARY KEY (`Game_ID`,`Platform_ID`),
  KEY `plays_on_ibfk_2` (`Platform_ID`),
  CONSTRAINT `plays_on_ibfk_1` FOREIGN KEY (`Game_ID`) REFERENCES `game` (`Game_ID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `plays_on_ibfk_2` FOREIGN KEY (`Platform_ID`) REFERENCES `platform` (`Platform_ID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plays_on`
--

LOCK TABLES `plays_on` WRITE;
/*!40000 ALTER TABLE `plays_on` DISABLE KEYS */;
INSERT INTO `plays_on` VALUES (2,1),(12,1),(14,1),(15,1),(16,1),(24,1),(12,2),(13,2),(12,3),(2,4),(12,4),(23,4),(25,4),(2,5),(12,5),(14,5),(17,5),(23,5),(25,5),(2,6),(12,6),(13,6),(14,6),(15,6),(16,6),(17,6),(18,6),(23,6),(24,6),(27,6),(29,6),(2,7),(12,7),(14,7),(17,7),(23,7),(25,7),(2,8),(13,8),(23,8),(25,8),(27,8),(29,8),(2,9),(13,9),(23,9),(25,9),(27,9),(29,9),(16,10),(17,10),(16,11),(17,11),(30,12);
/*!40000 ALTER TABLE `plays_on` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rates`
--

DROP TABLE IF EXISTS `rates`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rates` (
  `User_ID` int NOT NULL,
  `Game_ID` int NOT NULL,
  `Review_ID` int NOT NULL,
  PRIMARY KEY (`User_ID`,`Game_ID`,`Review_ID`),
  KEY `rates_ibfk_3` (`Review_ID`),
  KEY `rates_ibfk_2_idx` (`Game_ID`),
  CONSTRAINT `rates_ibfk_1` FOREIGN KEY (`User_ID`) REFERENCES `user` (`User_ID`) ON DELETE CASCADE,
  CONSTRAINT `rates_ibfk_2` FOREIGN KEY (`Game_ID`) REFERENCES `game` (`Game_ID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `rates_ibfk_3` FOREIGN KEY (`Review_ID`) REFERENCES `review` (`Review_ID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rates`
--

LOCK TABLES `rates` WRITE;
/*!40000 ALTER TABLE `rates` DISABLE KEYS */;
INSERT INTO `rates` VALUES (4,2,5),(4,16,6),(7,2,7),(7,14,8),(7,13,9);
/*!40000 ALTER TABLE `rates` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `receives`
--

DROP TABLE IF EXISTS `receives`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `receives` (
  `Admin_ID` int NOT NULL,
  `Request_ID` int NOT NULL,
  PRIMARY KEY (`Admin_ID`,`Request_ID`),
  KEY `receives_ibfk_2` (`Request_ID`),
  CONSTRAINT `receives_ibfk_1` FOREIGN KEY (`Admin_ID`) REFERENCES `admin` (`Admin_ID`) ON DELETE CASCADE,
  CONSTRAINT `receives_ibfk_2` FOREIGN KEY (`Request_ID`) REFERENCES `game_request` (`Request_ID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `receives`
--

LOCK TABLES `receives` WRITE;
/*!40000 ALTER TABLE `receives` DISABLE KEYS */;
/*!40000 ALTER TABLE `receives` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `removed_review`
--

DROP TABLE IF EXISTS `removed_review`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `removed_review` (
  `Admin_ID` int NOT NULL,
  `Review_ID` int NOT NULL,
  PRIMARY KEY (`Admin_ID`,`Review_ID`),
  KEY `can_remove_ibfk_2` (`Review_ID`),
  CONSTRAINT `removed_review_ibfk_1` FOREIGN KEY (`Admin_ID`) REFERENCES `admin` (`Admin_ID`) ON DELETE CASCADE,
  CONSTRAINT `removed_review_ibfk_2` FOREIGN KEY (`Review_ID`) REFERENCES `review` (`Review_ID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `removed_review`
--

LOCK TABLES `removed_review` WRITE;
/*!40000 ALTER TABLE `removed_review` DISABLE KEYS */;
/*!40000 ALTER TABLE `removed_review` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `review`
--

DROP TABLE IF EXISTS `review`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `review` (
  `Review_ID` int NOT NULL AUTO_INCREMENT,
  `Comment` varchar(150) DEFAULT NULL,
  `Rating` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`Review_ID`),
  CONSTRAINT `review_chk_1` CHECK ((`rating` between 0 and 10))
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `review`
--

LOCK TABLES `review` WRITE;
/*!40000 ALTER TABLE `review` DISABLE KEYS */;
INSERT INTO `review` VALUES (5,'fun!',5),(6,'spooky game but fun!',4),(7,'bad game',1),(8,'Too hard!',3),(9,'booo vals bad',1);
/*!40000 ALTER TABLE `review` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `shelf`
--

DROP TABLE IF EXISTS `shelf`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `shelf` (
  `User_ID` int NOT NULL,
  `Shelf_ID` int NOT NULL AUTO_INCREMENT,
  `Num_of_games` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`Shelf_ID`,`User_ID`),
  KEY `shelf_FK` (`User_ID`),
  CONSTRAINT `shelf_FK` FOREIGN KEY (`User_ID`) REFERENCES `user` (`User_ID`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `shelf`
--

LOCK TABLES `shelf` WRITE;
/*!40000 ALTER TABLE `shelf` DISABLE KEYS */;
INSERT INTO `shelf` VALUES (4,1,0),(7,2,0),(8,3,0),(9,4,0),(10,5,0),(11,6,0);
/*!40000 ALTER TABLE `shelf` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `User_ID` int NOT NULL AUTO_INCREMENT,
  `User_password` varchar(255) NOT NULL,
  `User_username` varchar(20) NOT NULL,
  `AdminFlag` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`User_ID`),
  UNIQUE KEY `User_username_UNIQUE` (`User_username`),
  CONSTRAINT `user_chk_1` CHECK ((char_length(`User_password`) >= 8))
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (4,'$2b$10$R.TZBuu8CZEVkwoHCcsgW.vXeqvD6u.naexxjyxp8U5nl8kEvYQOO','Avastment',1),(7,'$2b$10$Qj4zoCVSqgxrYEdmeubzeOOWU6BsOB0KK9vyP0CV0Of2LL0EOZRB.','Pixel',1),(8,'$2b$10$jaDdubtKjLkaFLtpl2.jgu3qWbWcC6jtNvE595aB7l97hiJySXHAe','testeraccount',0),(9,'$2b$10$NjuXit6QilbgZQma0MmFre66NffZ7HG2ablb5RdnjEm0VWIEvaKB2','james',0),(10,'$2b$10$.vZrJbh3ssTeirIFbS0ZYOwUyo8q7ooE5OVQRiILaefxOzy2qL6Lm','random user',0),(11,'$2b$10$wonO68iLiAc2H.fYOlZVte2I5ykgXF4bxhIgAUeUfD.fCUPnYGNFO','bob',0);
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `wishlist`
--

DROP TABLE IF EXISTS `wishlist`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `wishlist` (
  `Game_ID` int NOT NULL,
  `User_ID` int NOT NULL,
  PRIMARY KEY (`User_ID`,`Game_ID`),
  KEY `wishlist_ibfk_2_idx` (`Game_ID`),
  CONSTRAINT `wishlist_ibfk_1` FOREIGN KEY (`User_ID`) REFERENCES `user` (`User_ID`) ON DELETE CASCADE,
  CONSTRAINT `wishlist_ibfk_2` FOREIGN KEY (`Game_ID`) REFERENCES `game` (`Game_ID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `wishlist`
--

LOCK TABLES `wishlist` WRITE;
/*!40000 ALTER TABLE `wishlist` DISABLE KEYS */;
/*!40000 ALTER TABLE `wishlist` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-12-09 17:38:47
