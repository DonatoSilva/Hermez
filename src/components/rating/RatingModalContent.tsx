import { StarFilled, StarOutlined } from '@ant-design/icons';
import { toastStore } from '@stores/StoreToast';
import { actions } from 'astro:actions';
import React, { useState } from 'react';

interface RatingModalContentProps {
    rateeId: string;
    rateeName: string;
    onClose: () => void;
    onSuccess?: () => void;
    onError?: () => void;
}

const RatingModalContent: React.FC<RatingModalContentProps> = ({ rateeId, rateeName, onClose, onSuccess, onError }) => {
    const [rating, setRating] = useState<number>(0);
    const [hoveredRating, setHoveredRating] = useState<number>(0);
    const [comment, setComment] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (rating === 0) {
            toastStore.set({
                visible: true,
                message: 'Por favor selecciona una calificación',
                type: 'error',
                autoClose: true,
                autoCloseDelay: 2500,
            });
            return;
        }

        setIsSubmitting(true);

        try {
            const { error } = await actions.User.createRating({
                ratee_id: rateeId,
                rating: rating,
                comment: comment || undefined,
            });

            onClose();
            if (onSuccess && !error) {
                onSuccess();
            } else {
               onError && onError();
            }
        } catch (error) {
            toastStore.set({
                visible: true,
                message: 'Error inesperado al enviar la calificación',
                type: 'error',
                autoClose: true,
                autoCloseDelay: 3000,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderStars = () => {
        const stars = [];
        const displayRating = hoveredRating || rating;

        for (let i = 1; i <= 10; i++) {
            stars.push(
                <button
                    key={i}
                    type="button"
                    onClick={() => setRating(i)}
                    onMouseEnter={() => setHoveredRating(i)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="text-3xl transition-transform hover:scale-110 focus:outline-none"
                >
                    {i <= displayRating ? (
                        <StarFilled className="text-yellow-500" />
                    ) : (
                        <StarOutlined className="text-gray-400 dark:text-gray-600" />
                    )}
                </button>
            );
        }

        return stars;
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="text-center">
                <p className="text-lg mb-2">
                    ¿Cómo calificarías a <span className="font-bold">{rateeName}</span>?
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    Selecciona estrellas del 0 al 10
                </p>
            </div>

            <div className="flex justify-center gap-2">
                {renderStars()}
            </div>

            <div className="text-center">
                <span className="text-4xl font-bold text-H-blue-700 dark:text-H-blue-500">
                    {rating}/10
                </span>
            </div>

            <div className="flex flex-col gap-2">
                <label htmlFor="comment" className="font-medium">
                    Comentario (opcional)
                </label>
                <textarea
                    id="comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Comparte tu experiencia con este domiciliario..."
                    className="w-full min-h-[100px] p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 resize-none focus:outline-none focus:ring-2 focus:ring-H-blue-500"
                    maxLength={500}
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 text-right">
                    {comment.length}/500
                </p>
            </div>

            <div className="flex gap-4">
                <button
                    type="button"
                    onClick={onClose}
                    disabled={isSubmitting}
                    className="flex-1 bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 py-3 px-4 rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    disabled={isSubmitting || rating === 0}
                    className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white py-3 px-4 rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? 'Enviando...' : 'Enviar Calificación'}
                </button>
            </div>
        </form>
    );
};

export default RatingModalContent;
