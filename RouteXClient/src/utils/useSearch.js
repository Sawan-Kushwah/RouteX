import { useState } from 'react'

/**
 * Custom hook for reusable search functionality
 * @param {Array} items - The array of items to search through
 * @param {Array<string>} searchFields - The fields to search in each item
 * @returns {Object} - { searchQuery, setSearchQuery, filteredItems }
 */

export function useSearch(searchQuery, items, searchFields = []) {

    const filteredItems = items.filter((item) => {
        if (!searchQuery) return true
        const q = searchQuery.toLowerCase()
        return searchFields.some((field) => {
            const value = item[field]
            return value && value.toString().toLowerCase().includes(q)
        })
    })

    return { filteredItems }
}
