import { useState } from 'react';
import api from '../api/api';

const UnsplashModal = ({ onClose, onSelectImage }) => {
    const [query, setQuery] = useState('');
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(false);

    // Fungsi Cari Gambar
    const searchImages = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Panggil API Backend kita sendiri
            const response = await api.get(`/unsplash/search?query=${query}`);
            setImages(response.data.data);
        } catch (error) {
            console.error(error);
            alert("Gagal mengambil gambar");
        }
        setLoading(false);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl h-[80vh] flex flex-col">
                
                {/* Header Modal */}
                <div className="flex justify-between items-center p-4 border-b">
                    <h3 className="text-lg font-bold">Cari Referensi Unsplash</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-red-500 font-bold">
                        ✕ Tutup
                    </button>
                </div>

                {/* Body: Form Pencarian */}
                <div className="p-4 border-b bg-gray-50">
                    <form onSubmit={searchImages} className="flex gap-2">
                        <input 
                            type="text" 
                            className="flex-1 border rounded px-3 py-2 focus:ring focus:ring-blue-300 outline-none"
                            placeholder="Ketik nama aset (ex: laptop, drone)..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                        <button 
                            type="submit" 
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                            disabled={loading}
                        >
                            {loading ? '...' : 'Cari'}
                        </button>
                    </form>
                </div>

                {/* Body: Grid Gambar */}
                <div className="flex-1 overflow-y-auto p-4">
                    {images.length === 0 && !loading && (
                        <p className="text-center text-gray-400 mt-10">Silakan cari gambar...</p>
                    )}

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {images.map((img) => (
                            <div key={img.id} className="group relative border rounded overflow-hidden cursor-pointer hover:shadow-lg">
                                <img 
                                    src={img.thumbnail} 
                                    alt={img.description} 
                                    className="w-full h-32 object-cover"
                                />
                                {/* Overlay saat hover */}
                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition flex items-center justify-center">
                                    <button 
                                        onClick={() => onSelectImage(img.full_image)}
                                        className="opacity-0 group-hover:opacity-100 bg-green-500 text-white px-3 py-1 rounded text-sm font-bold shadow"
                                    >
                                        Pilih Gambar Ini
                                    </button>
                                </div>
                                <div className="p-1 text-xs text-gray-500 truncate bg-white">
                                    by {img.photographer}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UnsplashModal;