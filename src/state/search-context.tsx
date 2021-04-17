
import React, { createContext, Dispatch, SetStateAction, useContext, useState } from 'react'
import { Product, Order, UserInfo } from '../types'

interface Props {

}

type SearchState = { 
    searchedItems: Product[] | Order[] | UserInfo[] | null
}

type SearchDispatch = { 
    setSearchedItems: Dispatch<SetStateAction<Product[] | Order[] | UserInfo[] | null>>
}

const SearchStateContext = createContext<SearchState | undefined>(undefined)
const SearchDispatchContext = createContext<SearchDispatch | undefined>(undefined)

const SearchContextProvider: React.FC<Props> = ({children}) => {
    const [searchedItems, setSearchedItems] = useState<Product[] | Order[] | UserInfo[] | null>(null)
        return (
        <SearchStateContext.Provider value={{searchedItems}}>
            <SearchDispatchContext.Provider value={{setSearchedItems}}>
            {children}
            </SearchDispatchContext.Provider>
        </SearchStateContext.Provider>);
}

export default SearchContextProvider

export const useSearchContext = () =>{
    const searchedState = useContext(SearchStateContext)
    const searchedDispatch = useContext(SearchDispatchContext)

    if( searchedState === undefined || searchedDispatch === undefined) throw new Error('useSearchContext must be used with SearchContextProvider ')

    return {...searchedState,...searchedDispatch}
}