-- MySQL Workbench Forward Engineering

--//PLE Use code new code Create table!.

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
-- -----------------------------------------------------
-- Schema mymusic
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema mymusic
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `mymusic` DEFAULT CHARACTER SET utf8mb4 ;
USE `mymusic` ;

-- -----------------------------------------------------
-- Table `mymusic`.`tbl_album`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mymusic`.`tbl_album` (
  `album_id` VARCHAR(10) NOT NULL,
  `album_name` VARCHAR(45) NOT NULL,
  `date_release_album` DATETIME NULL DEFAULT NULL,
  `album_description` VARCHAR(2000) NULL DEFAULT NULL,
  PRIMARY KEY (`album_id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4;


-- -----------------------------------------------------
-- Table `mymusic`.`tbl_singer`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mymusic`.`tbl_singer` (
  `singer_id` VARCHAR(10) NOT NULL,
  `singer_name` VARCHAR(45) NOT NULL,
  `singer_description` VARCHAR(2000) NULL DEFAULT NULL,
  `day_of_birth` DATETIME NULL DEFAULT NULL,
  `hometown` VARCHAR(45) NULL DEFAULT NULL,
  PRIMARY KEY (`singer_id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4;


-- -----------------------------------------------------
-- Table `mymusic`.`tbl_song`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mymusic`.`tbl_song` (
  `song_id` VARCHAR(10) NOT NULL,
  `song_name` VARCHAR(45) NOT NULL,
  `listen_count` INT(20) NOT NULL,
  `rate` DOUBLE NULL DEFAULT NULL,
  PRIMARY KEY (`song_id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4;


-- -----------------------------------------------------
-- Table `mymusic`.`tbl_begin`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mymusic`.`tbl_begin` (
  `song_id` VARCHAR(10) NOT NULL,
  `singer_id` VARCHAR(10) NOT NULL,
  `album_id` VARCHAR(10) NOT NULL,
  `date` DATETIME NULL DEFAULT NULL,
  `location` VARCHAR(45) NULL DEFAULT NULL,
  PRIMARY KEY (`song_id`, `singer_id`, `album_id`),
  INDEX `fk_singer_id_idx` (`singer_id` ASC) VISIBLE,
  INDEX `fk_album_id_idx` (`album_id` ASC) VISIBLE,
  CONSTRAINT `fk_album_id`
    FOREIGN KEY (`album_id`)
    REFERENCES `mymusic`.`tbl_album` (`album_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_singer_id`
    FOREIGN KEY (`singer_id`)
    REFERENCES `mymusic`.`tbl_singer` (`singer_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_song_id_1`
    FOREIGN KEY (`song_id`)
    REFERENCES `mymusic`.`tbl_song` (`song_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4;


-- -----------------------------------------------------
-- Table `mymusic`.`tbl_song_type`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mymusic`.`tbl_song_type` (
  `type_id` VARCHAR(10) NOT NULL,
  `type_name` VARCHAR(100) NOT NULL,
  `description` VARCHAR(2000) NULL DEFAULT NULL,
  PRIMARY KEY (`type_id`),
  CONSTRAINT `fk_song_id_2`
    FOREIGN KEY (`type_id`)
    REFERENCES `mymusic`.`tbl_song` (`song_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4;


-- -----------------------------------------------------
-- Table `mymusic`.`tbl_writer`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mymusic`.`tbl_writer` (
  `writer_id` VARCHAR(10) NOT NULL,
  `writer_name` VARCHAR(45) NOT NULL,
  `writer_description` VARCHAR(2000) NULL DEFAULT NULL,
  PRIMARY KEY (`writer_id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4;


-- -----------------------------------------------------
-- Table `mymusic`.`tbl_song_writer`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mymusic`.`tbl_song_writer` (
  `date_of_writing` VARCHAR(40) NOT NULL,
  `song_id` VARCHAR(10) NOT NULL,
  `writer_id` VARCHAR(10) NOT NULL,
  PRIMARY KEY (`song_id`, `writer_id`),
  INDEX `fk_writer_id_idx` (`writer_id` ASC) VISIBLE,
  CONSTRAINT `fk_song_id`
    FOREIGN KEY (`song_id`)
    REFERENCES `mymusic`.`tbl_song` (`song_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_writer_id`
    FOREIGN KEY (`writer_id`)
    REFERENCES `mymusic`.`tbl_writer` (`writer_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;


