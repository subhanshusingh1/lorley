import React, { useState, useEffect } from 'react';
import { FaStar } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import axios for API calls
import { submitReview } from '../../actions/reviewActions'; // Redux action

const Review = ({ businessId, businessName, userName }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { success, error } = useSelector((state) => state.review);

    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [description, setDescription] = useState('');
    const [images, setImages] = useState([]); // Actual image files
    const [imagePreviews, setImagePreviews] = useState([]); // Image preview URLs
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    // Handle image selection and preview generation
    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setImages(files);

        // Generate preview URLs
        const filePreviews = files.map((file) => URL.createObjectURL(file));
        setImagePreviews(filePreviews);
    };

    // Upload images to Cloudinary
    const handleImageUpload = async () => {
        const imageUploadPromises = images.map(async (image) => {
            const formData = new FormData();
            formData.append('file', image);
            formData.append('upload_preset', 'your_upload_preset'); // Replace with your Cloudinary upload preset

            try {
                const response = await axios.post('http://localhost:5000/api/v1/review/upload-photos/:id', formData);
                return response.data.secure_url; // Cloudinary URL for the uploaded image
            } catch (error) {
                console.error('Error uploading image:', error);
                return null;
            }
        });

        const urls = await Promise.all(imageUploadPromises);
        return urls.filter((url) => url !== null); // Filter out any failed uploads
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Upload images to Cloudinary first
        const uploadedImageUrls = await handleImageUpload();

        // Prepare formData for review submission
        const reviewData = {
            rating,
            comment: description,
            images: uploadedImageUrls, // Attach image URLs to the review
        };

        // Dispatch the review submission action with the businessId and reviewData
        dispatch(submitReview({ businessId, reviewData }));
    };

    // Handle review success/error state
    useEffect(() => {
        if (success) {
            setSuccessMessage('Your review has been successfully submitted!');
            setDescription('');
            setRating(0);
            setImages([]);
            setImagePreviews([]);

            setErrorMessage(''); // Clear error message

            // Redirect to the business profile page after a short delay
            setTimeout(() => {
                navigate(`/business/profile/${businessId}`);
            }, 2000);
        }

        if (error) {
            setErrorMessage(error);
            setSuccessMessage('');
        }
    }, [success, error, businessId, navigate]);

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
            <div className="p-6 bg-white shadow-lg rounded-lg max-w-lg w-full">
                <h1 className="text-2xl md:text-3xl font-bold mb-4 text-center">{businessName}</h1>
                <h2 className="text-xl md:text-2xl font-semibold mb-4 text-center">Leave a Review</h2>

                <div className="mb-4 text-center">
                    <span className="font-semibold">User: {userName}</span>
                </div>

                <div className="flex justify-center mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <FaStar
                            key={star}
                            className={`cursor-pointer text-2xl ${star <= (hover || rating) ? 'text-yellow-500' : 'text-gray-400'}`}
                            onClick={() => setRating(star)}
                            onMouseEnter={() => setHover(star)}
                            onMouseLeave={() => setHover(0)}
                        />
                    ))}
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <textarea
                        className="w-full border rounded-lg p-4 mb-4 h-28 resize-none"
                        placeholder="Write your review here..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    ></textarea>

                    <label className="block text-sm font-medium text-gray-700 mb-2">Upload Images</label>
                    <input
                        type="file"
                        multiple
                        onChange={handleImageChange}
                        accept="image/*"
                        className="block w-full text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-full file:border-0
                        file:text-sm file:font-semibold
                        file:bg-blue-50 file:text-blue-700
                        hover:file:bg-blue-100
                        mb-4"
                    />

                    {/* Image Previews */}
                    <div className="flex flex-wrap gap-4 justify-center">
                        {imagePreviews.map((preview, index) => (
                            <div key={index} className="relative">
                                <img src={preview} alt="Preview" className="w-20 h-20 object-cover rounded-lg shadow-md" />
                            </div>
                        ))}
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition"
                    >
                        Submit Review
                    </button>
                </form>

                {successMessage && <p className="text-green-500 text-center mt-4">{successMessage}</p>}
                {errorMessage && <p className="text-red-500 text-center mt-4">{errorMessage}</p>}
            </div>
        </div>
    );
};

export default Review;
