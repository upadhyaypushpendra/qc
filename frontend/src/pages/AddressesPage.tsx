import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import apiClient from '../lib/apiClient';
import toast from 'react-hot-toast';
import { Phone, Edit2, Trash } from 'lucide-react';

interface Address {
  id: string;
  label: string;
  line1: string;
  line2?: string;
  city: string;
  postcode: string;
  phone?: string;
  isDefault: boolean;
}

export default function AddressesPage() {
  const navigate = useNavigate();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: addresses, refetch } = useQuery({
    queryKey: ['addresses'],
    queryFn: async () => {
      const response = await apiClient.get('/users/addresses');
      return response.data as Address[];
    },
  });

  const handleDelete = async (id: string) => {
    try {
      await apiClient.delete(`/users/addresses/${id}`);
      toast.success('Address deleted');
      setDeleteId(null);
      refetch();
    } catch (error) {
      toast.error('Failed to delete address');
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-brand-700">My Addresses</h1>
        <button
          onClick={() => navigate('/addresses/new')}
          className="bg-brand-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-brand-700"
        >
          + Add New
        </button>
      </div>

      <div className="space-y-4">
        {addresses && addresses.length > 0 ? (
          addresses.map((address) => (
            <div
              key={address.id}
              className="bg-brand-50 border-2 border-brand-200 rounded-lg p-4"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-bold text-brand-700 text-lg">{address.label}</h3>
                  <p className="text-gray-300">{address.line1}</p>
                  {address.line2 && <p className="text-gray-300">{address.line2}</p>}
                  <p className="text-gray-300">
                    {address.city}, {address.postcode}
                  </p>
                  {address.phone && <p className="text-gray-300 flex items-center gap-1"><Phone className="w-3 h-3" /> {address.phone}</p>}
                  {address.isDefault && (
                    <span className="inline-block mt-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                      Default
                    </span>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => navigate(`/addresses/${address.id}/edit`)}
                    className="bg-blue-500 text-white p-3 rounded hover:bg-blue-600"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteId(address.id)}
                    className="bg-red-500 text-white p-3 rounded hover:bg-red-600"
                  >
                    <Trash className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-400 py-8">No addresses saved yet</p>
        )}
      </div>

      {deleteId && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setDeleteId(null)}>
          <div className="bg-gray-800 rounded-lg p-6 max-w-sm shadow-xl" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-xl font-bold mb-4 text-red-400">Delete Address?</h2>
            <p className="text-gray-300 mb-6">
              Are you sure you want to delete this address? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 bg-gray-600 text-gray-200 py-2 rounded font-bold hover:bg-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                className="flex-1 bg-red-500 text-white py-2 rounded font-bold hover:bg-red-600"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
