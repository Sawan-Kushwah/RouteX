import { useState } from 'react'
import SuccessModal from '../components/SuccessModal'
import axios from 'axios'
import server from '../utils/backendServer'
import { toast } from 'react-toastify'

export default function BusForm({ onClose, setBusDataChanged, setRoutesDataChanged }) {
    const [busNo, setBusNo] = useState()
    const [numberPlate, setNumberPlate] = useState('')
    const [status, setStatus] = useState('inactive')
    const [addedBus, setAddedBus] = useState(null)

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!busNo.trim() || !numberPlate.trim()) {
            toast.info('Please enter bus number and number plate')
            return
        }
        // console.log('submitting bus:', { busNo, numberPlate, status })
        const response = await axios.post(`${server}/bus/addBus`, {
            busNo: busNo,
            numberPlate: numberPlate.trim().toLowerCase(),
            status: status.toLowerCase()
        })
        if (response.status === 200) {
            setAddedBus(response.data.bus)
           
            setBusNo('')
            setNumberPlate('')
            setStatus("inactive")
            setBusDataChanged(true);
            setRoutesDataChanged(true)
            setAddedBus(null)
            if (typeof onClose === 'function') onClose()
        } else {
            toast.error('Failed to add bus. Please try again.')
            return
        }
    }


    return (
        <>
            <div className="fixed inset-0 bg-[#000000c9] flex items-center justify-center z-50 sm:p-4 p-2">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 sm:w-80 w-full ">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Add New Bus</h3>
                        <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">×</button>

                    </div>

                    <form onSubmit={handleSubmit} className="space-y-3">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Bus No</label>
                            <input
                                value={busNo}
                                onChange={(e) => { 
                                    if(typeof e.target.value === "string")
                                    setBusNo(e.target.value)
                                    else{
                                        toast.warning("bus No should be Number");
                                    }
                                }
                            }
                                className="w-full mt-1 px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                placeholder="e.g. 101"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Number Plate</label>
                            <input
                                value={numberPlate.toUpperCase()}
                                onChange={(e) =>
                                    {
                                        
                                            setNumberPlate(e.target.value)
                                       
                                    }
                                    }
                                className="w-full mt-1 px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                placeholder="e.g., ABC-1234"
                            />
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
