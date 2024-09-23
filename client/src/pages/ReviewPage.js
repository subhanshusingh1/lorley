import React, { useState, useEffect } from 'react';
import { FaStar } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'; // For navigation
import { submitReview } from '../actions/reviewActions';

const Review = ({ businessId, businessName, userName }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate(); // For redirecting after submission
    const { success, error } = useSelector((state) => state.review);

    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0); // For half-star hover effect
    const [description, setDescription] = useState('');
    const [images, setImages] = useState([]);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setImages(files);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('rating', rating);
        formData.append('comment', description);
        images.forEach((image) => {
            formData.append('images', image);
        });

        // Dispatch the submitReview action
        dispatch(submitReview({ businessId, formData }));
    };

    // Update success and error messages based on Redux state
    useEffect(() => {
        if (success) {
            setSuccessMessage('Your review has been successfully submitted!');
            setDescription('');
            setRating(0);
            setImages([]);

            setErrorMessage(''); // Clear error message

            // Redirect to the business profile page after a short delay
            setTimeout(() => {
                navigate(`/business/profile/${businessId}`); // Redirect to business profile
            }, 2000); // Redirect after 2 seconds
        }

        if (error) {
            setErrorMessage(error); // Set error message from Redux
            setSuccessMessage(''); // Clear success message
        }
    }, [success, error, businessId, navigate]);

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="p-6 bg-white shadow-lg rounded-lg max-w-lg w-full">
                <h1 className="text-3xl font-bold mb-6 text-center">{businessName}</h1> {/* Business Name on top */}
                <h2 className="text-2xl font-semibold mb-6 text-center">Leave a Review</h2>

                <div className="mb-4 text-center">
                    <span className="font-semibold">User: {userName}</span>
                </div>

                <div className="flex justify-center mb-6">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <FaStar
                            key={star}
                            className={`cursor-pointer text-2xl ${
                                star <= (hover || rating) ? 'text-yellow-500' : 'text-gray-400'
                            }`}
                            onClick={() => setRating(star)}
                            onMouseEnter={() => setHover(star)}
                            onMouseLeave={() => setHover(0)}
                        />
                    ))}
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <textarea
                        className="w-full border rounded-lg p-4 mb-4 h-28"
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
