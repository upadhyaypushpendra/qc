import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../lib/apiClient';
import toast from 'react-hot-toast';

interface Address {
  id?: string;
  label: string;
  line1: string;
  line2?: string;
  city: string;
  postcode: string;
  phone: string;
  isDefault?: boolean;
}

export default function AddressFormPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { id } = useParams();
  const isEdit = !!id;

  const [formData, setFormData] = useState<Address>({
    label: '',
    line1: '',
    line2: '',
    city: '',
    postcode: '',
    phone: '',
    isDefault: false,
  });

  // Fetch address if editing
  const { data: existingAddress, isLoading } = useQuery({
    queryKey: ['address', id],
    queryFn: async () => {
      const response = await apiClient.get(`/users/addresses/${id}`);
      return response.data as Address;
    },
    enabled: isEdit,
  });

  useEffect(() => {
    if (existingAddress) {
      setFormData(existingAddress);
    }
  }, [existingAddress]);

  // Create/Update mutation
  const mutation = useMutation({
    mutationFn: async (data: Address) => {
      const { id: _, userId: __, ...submitData } = data as any;
      if (isEdit) {
        return apiClient.patch(`/users/addresses/${id}`, submitData);
      } else {
        return apiClient.post('/users/addresses', submitData);
      }
    },
    onSuccess: () => {
      toast.success(isEdit ? 'Address updated' : 'Address added');
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
      navigate('/addresses');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message?.[0] || 'Failed to save address');
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    });
  };

  const handleMapPin = () => {
    // Open Google Maps with the address
    const query = encodeURIComponent(`${formData.line1} ${formData.line2 ? formData.line2 + ' ' : ''}${formData.city} ${formData.postcode}`);
    window.open(`https://maps.google.com/?q=${query}`, '_blank');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.label || !formData.line1 || !formData.city || !formData.postcode || !formData.phone) {
      toast.error('Please fill all required fields');
      return;
    }
    mutation.mutate(formData);
  };

  if (isEdit && isLoading) {
    return <div className="text-center py-8">Loading address...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-brand-700">
        {isEdit ? 'Edit Address' : 'Add New Address'}
      </h1>

      <form onSubmit={handleSubmit} className="bg-brand-50 border-2 border-brand-200 rounded-lg p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-brand-700">Label *</label>
          <input
            type="text"
            name="label"
            value={formData.label}
            onChange={handleChange}
            placeholder="e.g., Home, Work"
            className="w-full border-2 border-brand-300 rounded px-3 py-2 focus:border-brand-600 focus:outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-brand-700">Street Address *</label>
          <input
            type="text"
            name="line1"
            value={formData.line1}
            onChange={handleChange}
            placeholder="e.g., 123 Main St"
            className="w-full border-2 border-brand-300 rounded px-3 py-2 focus:border-brand-600 focus:outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-brand-700">Apt/Suite (Optional)</label>
          <input
            type="text"
            name="line2"
            value={formData.line2}
            onChange={handleChange}
            placeholder="e.g., Apt 4B"
            className="w-full border-2 border-brand-300 rounded px-3 py-2 focus:border-brand-600 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-brand-700">City *</label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="e.g., New York"
            className="w-full border-2 border-brand-300 rounded px-3 py-2 focus:border-brand-600 focus:outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-brand-700">Postal Code *</label>
          <input
            type="text"
            name="postcode"
            value={formData.postcode}
            onChange={handleChange}
            placeholder="e.g., 10001"
            className="w-full border-2 border-brand-300 rounded px-3 py-2 focus:border-brand-600 focus:outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-brand-700">Phone Number *</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="e.g., +91 98765 43210"
            className="w-full border-2 border-brand-300 rounded px-3 py-2 focus:border-brand-600 focus:outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-brand-700">Set as Default</label>
          <input
            type="checkbox"
            name="isDefault"
            checked={formData.isDefault}
            onChange={handleChange}
            className="w-4 h-4 border-2 border-brand-300 rounded"
          />
        </div>

        <div className="border-t pt-4">
          <button
            type="button"
            onClick={handleMapPin}
            className="w-full bg-blue-500 text-white py-2 rounded font-bold hover:bg-blue-600"
          >
            📍 View on Google Maps
          </button>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={() => navigate('/addresses')}
            className="flex-1 bg-gray-300 text-gray-700 py-3 rounded font-bold hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={mutation.isPending}
            className="flex-1 bg-brand-600 text-white py-3 rounded font-bold hover:bg-brand-700 disabled:bg-gray-300"
          >
            {mutation.isPending ? 'Saving...' : isEdit ? 'Update Address' : 'Add Address'}
          </button>
        </div>
      </form>
    </div>
  );
}
