import React, {useEffect, useState} from 'react'
import { makeAutoObservable } from "mobx"
import Exonn__TransferList from './components/TransferList'
import './App.css'

// just for generation of readable items
const generateItems = (itemsCount) => {
    const startItems = ['Battery type', 'Item name', 'Lorem ipsum']

    return new Array(itemsCount)
        .fill(0)
        .map((val, itemIndex) => itemIndex < startItems.length ? startItems[itemIndex] : `Item name ${itemIndex + 1}`)
}

const createItemLists = () => {
    // get 10 random items
    const itemList = generateItems(10)

    return {
        itemListLeft: itemList.slice(0, itemList.length - 2),
        itemListRight: itemList.slice(itemList.length - 2),
    }
}

const itemLists = createItemLists()

function App() {

    return (
        <>
            <Exonn__TransferList {...itemLists} onSave={() => {
                console.log('list saved')
            }}/>
        </>
    )
}

export default App
