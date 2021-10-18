import React, { useEffect, useState, useRef } from 'react';
import { Text, View, Pressable } from 'react-native';
import Entypo from '@expo/vector-icons/Entypo';
import styles from '../style/style';

const START = 'plus';
const CROSS = 'cross';
const CIRCLE = 'circle';
const NBR_OF_COLS = 5;
const NBR_OF_ROWS = 5;
let initialBoard = new Array(NBR_OF_COLS * NBR_OF_ROWS).fill(START);
const NBR_OF_SHIPS = 3;
const NBR_OF_BOMBS = 15;

export default function Gameboard() {

    const [board, setBoard] = useState(initialBoard);
    const [hits, setHits] = useState(0);
    const [nbrOfBombs, setNbrOfBombs] = useState(NBR_OF_BOMBS);
    const [status, setStatus] = useState("");
    const [ships, setShips] = useState([])
    const [noShip, setNoShip] = useState(true);
    const [time, setTime] = useState(30);
    const timer = useRef();

    const items = [];
    // Rivit
    for (let x = 0; x < NBR_OF_ROWS; x++) {
        const cols = [];
        // Sarakkeet
        for (let y = 0; y < NBR_OF_COLS; y++) {
            cols.push(
                <Pressable key={x * NBR_OF_COLS + y}
                    style={styles.item}
                    onPress={() => clicks(x * NBR_OF_COLS + y)}>
                    <Entypo key={x * NBR_OF_COLS + y}
                        name={board[x * NBR_OF_COLS + y]}
                        size={32}
                        color={chooseItemColor(x * NBR_OF_COLS + y)}>
                    </Entypo>
                </Pressable>
            )
        } // Sarakkeet
        let row =
            <View key={"row" + x}>
                {cols.map((item) => item)}
            </View>
        items.push(row);
    } // Rivit

    useEffect(() => {
        placeShips();
        if (hits === NBR_OF_SHIPS) {
            setStatus("You sinked all ships");
            clearInterval(timer.current);
        }
        if (nbrOfBombs === 0) {
            setStatus("Game over. Ships remaining.")
            clearInterval(timer.current);
        }
        if (time === 0) {
            setStatus("Timeout. Ships remaining");
            clearInterval(timer.current);
        }
    }, [hits, nbrOfBombs, time]);

    function clicks(click) {
        if (!timer.current) {
            setStatus("Press the start button first")
            return;
        }
        drawItem(click)
        setNbrOfBombs(state => state - 1)
    }

    function placeShips() {
        const nextShip = []
        const getRandomNumber = () => Math.floor(Math.random() * board.length + 1)

        while (nextShip.length < NBR_OF_SHIPS) {
            const randomnumber = getRandomNumber()
            if (!nextShip.includes(randomnumber)) nextShip.push(randomnumber)
        }
        setShips(nextShip)
    }

    function clock() {
        clearInterval(timer.current)
        setTime(30)
        const newInterval = setInterval(() => {
            setTime(state => state - 1);
        }, 1000);
        timer.current = newInterval
    }

    function drawItem(number) {
        setBoard(state => state.map((element, index) => {
            if (index === number) {
                if (ships.includes(number)) {
                    setHits(hits + 1);
                    return CIRCLE;
                }
                else {
                    return CROSS
                }
            }
            else {
                return element
            }
        }
        ));
    }

    function chooseItemColor(number) {
        if (board[number] === CROSS) {
            return "#FF3031"
        }
        else if (board[number] === CIRCLE) {
            return "#45CE30"
        }
        else {
            return "#74B9FF"
        }
    }

    function resetGame() {
        setHits(0);
        clock();
        setNbrOfBombs(NBR_OF_BOMBS);
        setNoShip(true);
        setStatus('Game is on');
        initialBoard = [...board];
        initialBoard = new Array(NBR_OF_COLS * NBR_OF_ROWS).fill(START);
        setBoard(initialBoard);
    }

    return (
        <View style={styles.gameboard}>
            <View style={styles.flex}>{items}</View>          
            <Text style={styles.gameinfo}>Hits: {hits}</Text>
            <Text style={styles.gameinfo}>Bombs: {nbrOfBombs}</Text>
            <Text style={styles.gameinfo}>Ships: {ships.length}</Text>
            <Text style={styles.gameinfo}>Time: {time}</Text>
            <Text style={styles.gameinfo}>Status: {status}</Text>
            <Pressable style={styles.button} onPress={() => resetGame()}>
                <Text style={styles.buttonText}>Start game</Text>
            </Pressable>
        </View>
    );
}