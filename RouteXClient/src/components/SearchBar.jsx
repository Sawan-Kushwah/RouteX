import { useState, useEffect, useRef } from 'react';

// import formatUpdateTime from '../utils/formatUpdateTime';
import useRouteSearch from '../utils/useRouteSearch';


export default function RouteSearch({ url, limit, fields }) {

    // jase he user type kare 
    // -> two way binding the query 
    // jase he user ruke foe 1 sec
    // -> make API call and show suggestions
    // jase he user Enter click ya search kare to 
    // -> make API call and show result

    // console.log(url,limit,fields);
    const [inputQuery, setInputQuery] = useState('');

    const [isSearching, setIsSearching] = useState(false);

    const inputRef = useRef();


    // when user clik search 
    const [showResults, setShowResults] = useState(false);

    // user wait stop typing for a sec
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    // display this result 
    // extract suggestions form this result
    // for making API call use setQuery 
    const [result, setQuery, loading] = useRouteSearch(url, fields, limit);
    // loading
    // console.log(result )

    // whenever 
    const debounceTimer = useRef(null);

    const getSuggestions = (data) => {
        if (!data) return []

        // console.log("data => ", data)

        const keywords = new Set();

        function checkString(str) {
            if (/^[A-Za-z]+$/.test(str)) return true;
            if (/^[0-9]+$/.test(str)) return true;
            return false;
        }



        data.forEach(obj => {
            // console.log("obj => ", obj)
            Object.values(obj).forEach(value => {
                if (typeof value === "string" || typeof value === "number") {
                    value.toString()
                        .toLowerCase()
                        .split(/[\s,.-]+/)   // split by space, comma, dot, dash
                        .forEach(word => {
                            // console.log(word)
                            if (word.length > 1 && word.includes(inputQuery) && checkString(word)) {
                                keywords.add(word);
                            }// ignore 1-letter words
                        });
                }
                // console.log("outside ", value, typeof value)
                if (typeof value == 'object') {
                    // console.log("hear => ", value)
                    Object.values(value).forEach(v => {
                        v.toString()
                            .toLowerCase()
                            .split(/[\s,.-]+/)   // split by space, comma, dot, dash
                            .forEach(word => {
                                // console.log(word)
                                if (word.length > 1 && word.includes(inputQuery)) {
                                    keywords.add(word);
                                }// ignore 1-letter words
                            });
                    })
                }

            });
        });

        return Array.from(keywords);
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
                // console.log(inputQuery);
                setQuery(inputQuery);

                setSuggestions(getSuggestions(result))
                if (!showResults)
                    setShowSuggestions(true);
            } catch (error) {
                console.error('Error searching routes:', error);
                // setSearchResults([]);
            } finally {
                setIsSearching(false);
            }
        }, 1000); // 500ms debounce

        return () => {
            if (debounceTimer.current) {
                clearTimeout(debounceTimer.current);
            }
        };
    }, [inputQuery, result]);


    const hendleSuggestionClick = (value) => {
        // console.log(value)
        // console.log("input -> ref",inputRef.current.value)
        inputRef.current.value = "";
        // console.log("input -> ref",inputRef.current.value)
        setInputQuery(value);
        setQuery(value);
        setShowSuggestions(false);
        setShowResults(true);
    }

    const handleSubmit = (value) =>{
        inputRef.current.value = "";
        // console.log("input -> ref",inputRef.current.value)
        setInputQuery(value);
        setQuery(value);
        setShowSuggestions(false);
        setShowResults(true);
    }


    return (
        // <div>


        <div className="w-96 rounded-xl shadow-2xl overflow-hidden bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 transition-all duration-300">
            {/* Search Header with Gradient Background */}
            {/* <div className="bg-linear-to-r from-red-600 to-red-700 dark:from-red-700 dark:to-red-800 p-4 shadow-lg"> */}
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
                    onKeyPress={(e) => {
                        setInputQuery(e.target.value);
                        // on user Enter make API call 
                        if (e.key === 'Enter') {
                            handleSubmit(e.target.value)
                        }
                    }
                    }
                    onChange={(e) => setInputQuery(e.target.value)}
                    onFocus={() => inputQuery && setShowResults(true)}
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
                        suggestions.map(item => {
                            return <div
                                onClick={() => { hendleSuggestionClick(item) }}
                                key={item} className='bg-gray-700 px-2 py-1 rounded m-1 cursor-pointer'>{item}</div>
                        })
                    }
                </div>
            }
            {
                showResults &&
                <div className="w-full  max-w-md mx-auto rounded-2xl border border-gray-400 p-4 bg-gray-900 text-white">

                    {/* Bus Number */}
                    <div className="w-full bg-gray-800 border border-gray-500 rounded-xl py-2 text-center text-2xl font-semibold">
                        Bus No ⇒ {(result && result.bus)? result.bus.busNo : "not defined"}
                    </div>

                   
                    {/* Stops Heading */}
                    <div className="mt-4 border-t border-b border-gray-500 py-3 text-center text-xl font-semibold">
                        Stops
                    </div>

                    {/* Stops List */}
                    <div className="mt-1 h-60 overflow-y-scroll space-y-4">
                        {
                            console.log(result)
                        }
                        { result &&  result.length > 0 && result[0].stops.length > 0 && 
                        result[0].stops.map((stop, index) => (
                            <div key={index} className=" text-lg bg-gray-500 rounded px-7">
                                {stop}
                                {/* <div className="w-full border-b border-gray-500"></div> */}
                            </div>
                        ))
                        || (
                        setShowResults(false) & alert("erroe in fetchin routs") )
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
