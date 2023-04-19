#
#
#
# create table tbl_song(
# 	song_id int primary key,
# 	name varchar(100) not null,
# 	description varchar(255) not null,
# 	type_id int not null//
# );
#
# create table tbl_song_type (
# 	type_id int primary key,
#     	name varchar(100) not null,
#     	description varchar(255),
# 	listen_count int,
# 	rate_1_star int,
# 	rate_2_star int,
# 	rate_3_star int,
# 	rate_4_star int,
# 	rate_5_star int
# );
#
#
# create table tbl_album (
# album_id int primary key,
#    	name varchar(100) not null,
#    	description varchar(255),
# 	date datetime not null,
# 	releasetype int not null
# );
#
#
# create table tbl_singer (
# singer_id int primary key,
#     	name varchar(100) not null,
# 	hometown varchar(255) not null,
# 	day_of_birth datetime not null,
# 	description varchar(255)
# );
#
#
# create table tbl_writer (
#  	writer_id int not null primary key,
#   	name varchar(100) not null,
# 	description varchar(255)
# );
#
#
# create table tbl_release_type(
# 	type_id int primary key,
# 	description varchar(255),
# 	name varchar(100) not null
# );
#
#
#
#
