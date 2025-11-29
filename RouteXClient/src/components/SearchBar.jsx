import { useState, useEffect, useRef } from 'react';

// import formatUpdateTime from '../utils/formatUpdateTime';
import useRouteSearch from '../utils/useRouteSearch';


export default function RouteSearch({ url, limit, fields , delay}) {

    // jase he user type kare 
    // -> two way binding the query 
    // jase he user ruke foe 1 sec
    // -> make API call and show suggestions
    // jase he user Enter click ya search kare to 
    // -> make API call and show result


    const [inputQuery, setInputQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    // when user clik search 
    const [showResults, setShowResults] = useState(false);
    // user wait stop typing for a sec
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    // display this result 
    // extract suggestions form this result
    // for making API call use setQuery 
    const [result, setQuery] = useRouteSearch(url, fields, limit);

    const [displayRoute, setDisplayRoute] = useState({});
    
    const inputRef = useRef();
    // whenever 
    const debounceTimer = useRef(null);

    const getSuggestions = (data) => {
        if (!data) return [];
        const suggestionRoutes = data.map(obj => {
            return obj.stops
        })
        return suggestionRoutes;
    }

    // Debounced search function
    useEffect(() => {
        if (debounceTimer.current) {
            clearTimeout(debounceTimer.current);
        }
        if (!inputQuery.trim()) {
            setShowResults(false);
            return;
        }
        setIsSearching(true);

        debounceTimer.current = setTimeout(async () => {
            try {
                setQuery(inputQuery);

                setSuggestions(getSuggestions(result))
                if (!showResults)
                    setShowSuggestions(true);
            } catch (error) {
                console.error('Error searching routes:', error);
            } finally {
                setIsSearching(false);
            }
        }, delay); // 500ms debounce

        return () => {
            if (debounceTimer.current) {
                clearTimeout(debounceTimer.current);
            }
        };
    }, [inputQuery, result]);


    const hendleSuggestionClick = (index) => {
        console.log("suggestion : ",index)
        inputRef.current.value = "";
        setDisplayRoute(result[index])
        setShowSuggestions(false);
        setShowResults(true);
    }



    return (
        <div className="w-96 rounded-xl shadow-2xl overflow-hidden bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 transition-all duration-300">
            <div className="relative">
                <div className="absolute left-3 top-3.5 text-white opacity-70">
                    <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                    </svg>
                </div>
                <input
                    type="text"
                    ref={inputRef}
                    placeholder="Search routes, stops, buses..."
                    value={inputQuery}
                    
                    onChange={(e) => setInputQuery(e.target.value)}
                    onFocus={() => inputQuery && setShowResults(false)}
                    className="w-full px-4 py-3 pl-10 rounded-lg bg-white dark:bg-gray-700 dark:text-gray-100 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-red-600 dark:ring-offset-red-800 transition font-medium"
                />
                {isSearching && (
                    <div className="absolute right-3 top-3.5">
                        <div className="w-5 h-5 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                )}
            </div>

            {/* show suggestiong */}
            {
                showSuggestions &&
                <div className='flex flex-wrap mt-2'>
                    
                    {
                        suggestions.map((item,index) => {
                            return <div
                                onClick={() => { hendleSuggestionClick(index) }}
                                key={item[0]} className='bg-gray-700 px-2 py-1 w-full truncate rounded m-1 cursor-pointer'>{item.join(", ")}</div>
                        })
                    }
                </div>
            }
            {
                showResults &&
                <div className="w-full  max-w-md mx-auto rounded-2xl border border-gray-400 p-4 bg-gray-900 text-white">

                    {/* Bus Number */}
                    {console.log("result => ",displayRoute)}
                    <div className="w-full bg-gray-800 border border-gray-500 rounded-xl py-2 text-center text-2xl font-semibold">
                        Bus No ⇒ {
                        (displayRoute)? displayRoute.bus.busNo : "not found"
                        }
                    </div>

                   
                    {/* Stops Heading */}
                    <div className="mt-4 border-t border-b border-gray-500 py-3 text-center text-xl font-semibold">
                        Stops
                    </div>

                    {/* Stops List */}
                    <div className="mt-1 h-60 overflow-y-scroll space-y-4">
                        {
                            console.log(displayRoute)
                        }
                        { displayRoute && displayRoute.stops.length > 0 && 
                        displayRoute.stops.map((stop, index) => (
                            <div key={index} className=" text-lg truncate bg-gray-500 rounded px-7">
                                {stop}
                            </div>
                        ))
                        }
                    </div>
                    <button
                    className='w-full py-4 rounded mt-3 text-center bg-blue-500 '
                        onClick={() => setInputQuery("")}
                    >
                        close
                    </button>
                </div>
            }
        </div>
    );
}
