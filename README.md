# Cyber4s Checkers Project

A (currently) private repo, consists of Tal Yakoubov's final project for Cyber4S Bootcamp Pre-Course

## Description

In this repository, you will find Tal's Checkers game project. Feel free to browse, I very much hope that you will like my code!

## Getting Started

### Code explanation video
* (insert link here)

### Dependencies

* No prerequisites whatsoever
* Basic JS, HTML & CSS

### How do I see the project?

* Clone the repo
* Make sure you have Live Server installed in VS Code
* Run with Live Server

## Implementations

### Class Piece
* Checkers piece, attributes include row, column, type, and boolean statements for detecting jumps & queen.

### Class BoardData
* Contains all the pieces that are on the board. 
* Includes functions that help acquire information (e.g. piece, empty cell), and alternatively remove pieces.

### Class Game
* Contains the local game's BoardData, stores information regarding game (e.g. current player, scores). 
* Includes functions that manifest the game rules

### App.js
* Uses all above classes to create the Checkerboard and execute a game of Checkers inside of the HTML.

## Features
* Checkers board with 24 pieces
* 2 Players - White, Black
* Every player can move play only on their turn
* Movement is based on the rules of the game
* Pieces can capture other pieces, game rules are abided
* End-of-Game Popup

### Extra features:
* Multiple jumps
* Backwards jumps supported (on multiple jumps, after first jump)
* Queen - Currently in development

## TODO:
### Complete Queen functionality 
* Currently able to move on any axis
* Implement jump-and-consume mechanism (abiding game rules)

## Authors

Tal Yakoubov
[@talyaak](https://github.com/talyaak/)

## Inspiration, code snippets, etc.
* [Cyber4s-Chess](https://github.com/talyaak/Cyber4S)
