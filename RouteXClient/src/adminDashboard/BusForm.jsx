import { useState } from 'react'
import axios from 'axios'
import server from '../utils/backendServer'
import { toast } from 'react-toastify'

export default function BusForm({ onClose, setBusDataChanged, setRoutesDataChanged }) {
    const [busNo, setBusNo] = useState()
    const [numberPlate, setNumberPlate] = useState('')
    const [pucExp, setPucExp] = useState(null);
    const [fittnessExp, setFittnessExp] = useState(null);
    const [roadTaxExp, setRoadTaxExp] = useState(null);
    const [permitExp, setPermitExp] = useState(null);
    const [status, setStatus] = useState('inactive')

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!busNo.trim() || !numberPlate.trim()) {
            toast.info('Please enter bus number and number plate')
            return
        }
        const response = await axios.post(`${server}/bus/addBus`, {
            busNo: busNo,
            pucExp,
            fittnessExp,
            roadTaxExp,
            permitExp,
            numberPlate: numberPlate.trim().toLowerCase(),
            status: status.toLowerCase()
        })
        if (response.status === 200) {
            toast.success(`Bus no ${busNo} added successfully`)
            setBusNo('')
            setNumberPlate('')
            setStatus("inactive")
            setBusDataChanged(true);
            setRoutesDataChanged(true)
            if (typeof onClose === 'function') onClose()
        } else {
            toast.error('Failed to add bus. Please try again.')
            return
        }
    }


    return (
        <>
            <div className="fixed inset-0 bg-[#000000c9] flex items-center justify-center z-50 sm:p-4 p-2">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 sm:w-1/2 w-full ">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Add New Bus</h3>
                        <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">×</button>

                    </div>

                    <form onSubmit={handleSubmit} className="space-y-3 ">
                        
                        <div className='grid grid-cols-2 gap-4'>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Bus No</label>
                                <input
                                    value={busNo}
                                    onChange={(e) => setBusNo(e.target.value)}
                                    className="w-full mt-1 px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    placeholder="e.g. 101"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Number Plate</label>
                                <input
                                    value={numberPlate.toUpperCase()}
                                    onChange={(e) => setNumberPlate(e.target.value)}
                                    className="w-full mt-1 px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    placeholder="e.g., AB-1234"
                                />
                            </div>
                       

                        {/* Date Fields */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">PUC Expiry</label>
                                <input
                                    type="date"
                                    value={pucExp || ''}
                                    onChange={(e) => setPucExp(e.target.value)}
                                    className="w-full mt-1 px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Fitness Expiry</label>
                                <input
                                    type="date"
                                    value={fittnessExp || ''}
                                    onChange={(e) => setFittnessExp(e.target.value)}
                                    className="w-full mt-1 px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Road Tax Expiry</label>
                                <input
                                    type="date"
                                    value={roadTaxExp || ''}
                                    onChange={(e) => setRoadTaxExp(e.target.value)}
                                    className="w-full mt-1 px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Permit Expiry</label>
                                <input
                                    type="date"
                                    value={permitExp || ''}
                                    onChange={(e) => setPermitExp(e.target.value)}
                                    className="w-full mt-1 px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="w-full mt-1 px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            >
                                <option>inactive</option>
                                <option>maintenance</option>
                            </select>
                        </div>

                        <div className="flex justify-end gap-2 pt-3">
                            <button type="button" onClick={onClose} className="px-3 py-2 bg-gray-600 cursor-pointer rounded-md hover:bg-gray-500">Cancel</button>
                            <button type="submit" className="px-3 py-2 bg-purple-600 text-white cursor-pointer rounded-md hover:bg-purple-700">Add Bus</button>
                        </div>
                    </form>

                </div>
            </div>


        </>
    )
}
