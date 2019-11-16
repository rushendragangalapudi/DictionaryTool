#!/bin/sh
case $# in
  0)
    echo "0 arg"
    node command.js random
    ;;
  1)
    echo "1 arg"
     node command.js wordcomplete $1
     ;;
  2)
    echo "2 arg"
    node command.js $1 $2
    ;;
  *)
    echo "Wrong number of arguments passed"
    exit 1;;
esac

# node command.js $1 $2